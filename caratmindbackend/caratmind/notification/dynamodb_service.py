# meow

# NEGATIVE_MOODS = {"sad", "anger", "fear", "disgust", "grief", "disappointment"}
# NEGATIVE_MOOD = {'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'}
from datetime import timedelta, timezone

import boto3

from caratmind import settings
from boto3.dynamodb.conditions import Attr, Key

from caratmind import datetime
from caratmind.datetime import today_local
from exercise.dynamodb_service import get_incomplete_exercise_on_date, get_user_exercises_on_date
from habit.dynamodb_services import get_user_habit
from journal.dynamodb_service import get_entries_for_user_on_date
from mood.dynamodb_service import calc_negative_mood_streak
from notification.ses_service import send_notification

STREAK_THRESHOLD_DAYS = 3

def _get_users_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USERS_TABLE)

def _get_notification_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_NOTIFICATION_TABLE)

def _get_mood_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_MOOD_TABLE)

# users with notifications enabled
# exercise, habit, journal, negative_mood, streak, summary_habit
def get_enabled_users(preference: str = 'journal') -> list[dict]:
    """
    use GSI when growing 
    """
    table = _get_users_table()
    response = table.scan(
        FilterExpression=Attr('user_email').exists() & Attr(f'notification_pref.{preference}').eq(True)
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=Attr('user_email').exists() & Attr(f'notification_pref.{preference}').eq(True),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# check if sent notification already or not
def already_notified(user_id: str, notif_type: str, period_str: str | None = None) -> bool:
    date_str = period_str or today_local().isoformat()
    table = _get_notification_table()
    response = table.get_item(
        Key={'user_id': user_id, 'notification_type_date': f'{notif_type}#{date_str}'}
    )
    return 'Item' in response

# mark notification if sent - save in table
def mark_notified(user_id: str, notif_type: str, period_str: str | None = None) -> None:
    date_str = period_str or today_local().isoformat()
    table = _get_notification_table()
    ttl = int((datetime.now(timezone.utc) + timedelta(days=30)).timestamp()) # valid for 30 days
    table.put_item(Item={
        'user_id': user_id,
        'notification_type_date': f'{notif_type}#{date_str}', #journal#2026-7-17
        'sent_at': datetime.now(timezone.utc).isoformat(),
        'ttl': ttl,
    })

# journal reminder
def check_journal_reminder(user: dict) -> None:
    if already_notified(user['user_id'], 'journal_reminder'):
        return

    today_str = today_local().isoformat()
    journal_today = get_entries_for_user_on_date(user['user_id'], today_str)    

    if not journal_today:
        send_notification(user['email'], 'journal_reminder', {'name': user.get('name', '')})
        mark_notified(user['user_id'], 'journal_reminder')

# exercise reminder only if got a journal submitted today
def check_exercise_reminder(user: dict) -> None:
    if already_notified(user['user_id'], 'exercise_reminder'):
        return

    today_str = today_local().isoformat()
    journal_today = get_entries_for_user_on_date(user['user_id'], today_str)  
    if not journal_today:
        return  

    incomplete_exercise = get_incomplete_exercise_on_date(user['user_id'], today_str)
    if not incomplete_exercise:
        send_notification(user['email'], 'exercise_reminder', {'name': user.get('name', '')})
        mark_notified(user['user_id'], 'exercise_reminder')

# negative mood
# def get_negative_mood_streak(user_id: str) -> int:
#     table = _get_mood_table()
#     today = today_local()
#     streak = 0

#     for i in range(30):  
#         day_str = (today - timedelta(days=i)).isoformat()
#         response = table.query(
#             KeyConditionExpression=Key('user_id').eq(user_id) & Key('date').eq(day_str)
#         )
#         items = response.get('Items', [])
#         if not items:
#             break  # gap in journaling breaks the streak

#         dominant_mood = items[0].get('dominant_mood')
#         if dominant_mood in NEGATIVE_MOODS:
#             streak += 1
#         else:
#             break

#     return streak

# long-term negative mood - helpline email
def check_mood_helpline(user: dict) -> None:
    if already_notified(user['user_id'], 'mood_helpline'):
        return

    streak = calc_negative_mood_streak(user['user_id'])
    if streak >= STREAK_THRESHOLD_DAYS:
        send_notification(user['email'], 'mood-helpline', {
            'name': user.get('name', ''),
            'streak_days': streak,
        })
        mark_notified(user['user_id'], 'mood_helpline')

# weekly habit summary once per week on Sunday
def send_weekly_habit(user: dict) -> None:
    today = today_local()
    if today.weekday() != 6: # Sunday
        return

    week_str = f'{today.isocalendar()[0]}-W{today.isocalendar()[1]}'
    if already_notified(user['user_id'], 'habit_summary', period_str=week_str):
        return
    
    start_date = (today - timedelta(days=6)).isoformat()
    end_date = today.isoformat()

    stats = get_user_habit(user['user_id'], start_date, end_date) 
    send_notification(user['email'], 'habit_summary', stats)
    mark_notified(user['user_id'], 'habit_summary', period_str=week_str)