# meow

# NEGATIVE_MOODS = {"sad", "anger", "fear", "disgust", "grief", "disappointment"}
# NEGATIVE_MOOD = {'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'}
from datetime import datetime, timedelta, timezone
import logging

import boto3

from caratmind import settings
from boto3.dynamodb.conditions import Attr, Key

from caratmind import datetime_utils
from caratmind.datetime_utils import today_local
from exercise.dynamodb_service import get_incomplete_exercise_on_date, get_user_exercises_on_date
from habit.dynamodb_services import get_user_habit, list_habit_summary
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
def is_notification_enabled(user: dict, notif_type: str) -> bool:
    return user.get('notification_pref', {}).get(notif_type, False)

def get_enabled_users() -> list[dict]:
    table = _get_users_table()
    response = table.scan(FilterExpression=Attr('user_email').exists())
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=Attr('user_email').exists(),
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
    if not is_notification_enabled(user, 'journal_reminder'):
        return
    if already_notified(user['user_id'], 'journal_reminder'):
        return

    today_str = today_local().isoformat()
    journal_today = get_entries_for_user_on_date(user['user_id'], today_str)    

    if not journal_today:
        send_notification(user['user_email'], 'journal_reminder', {'name': user.get('preferred_name', '')})
        mark_notified(user['user_id'], 'journal_reminder')

# exercise reminder only if got a journal submitted today
def check_exercise_reminder(user: dict) -> None:
    if not is_notification_enabled(user, 'exercise_reminder'):
        return
    if already_notified(user['user_id'], 'exercise_reminder'):
        return

    today_str = today_local().isoformat()
    journal_today = get_entries_for_user_on_date(user['user_id'], today_str)  
    if not journal_today:
        return  

    incomplete_exercise = get_incomplete_exercise_on_date(user['user_id'], today_str)
    if not incomplete_exercise:
        send_notification(user['user_email'], 'exercise_reminder', {'name': user.get('preferred_name', '')})
        mark_notified(user['user_id'], 'exercise_reminder')

# long-term negative mood - helpline email
def check_mood_helpline(user: dict) -> None:
    if not is_notification_enabled(user, 'mood_helpline'):
        return
    if already_notified(user['user_id'], 'mood_helpline'):
        return

    streak = calc_negative_mood_streak(user['user_id'])
    if streak >= STREAK_THRESHOLD_DAYS:
        send_notification(user['user_email'], 'mood_helpline', {
            'name': user.get('preferred_name', ''),
            'streak_days': streak,
        })
        mark_notified(user['user_id'], 'mood_helpline')

logger = logging.getLogger(__name__)

# weekly habit summary once per week on Sunday
def send_weekly_habit(user: dict) -> None:
    if not is_notification_enabled(user, 'habit_summary'):
        return
    today = today_local()
    if today.weekday() != 6: # Sunday
        return

    week_str = f'{today.isocalendar()[0]}-W{today.isocalendar()[1]}'
    if already_notified(user['user_id'], 'habit_summary', period_str=week_str):
        return
    
    start_date = (today - timedelta(days=6)).isoformat()
    end_date = today.isoformat()

    raw_items = get_user_habit(user['user_id'], start_date, end_date)
    logger.info(f"raw_items: {raw_items}")
    summary = list_habit_summary(raw_items)

    # stats = get_user_habit(user['user_id'], start_date, end_date) 
    response = send_notification(user['user_email'], 'habit_summary', {
        'name': user.get('preferred_name', ''),
        'days': summary,
    })
    print(f"SES response: {response}")
    mark_notified(user['user_id'], 'habit_summary', period_str=week_str)

# habit reminder
def check_habit_reminder(user: dict) -> None:
    if not is_notification_enabled(user, 'habit_reminder'):
        return
    if already_notified(user['user_id'], 'habit_reminder'):
        return

    today_str = today_local().isoformat()
    habit_today = get_user_habit(user['user_id'], today_str, today_str)    

    if not habit_today:
        send_notification(user['user_email'], 'habit_reminder', {'name': user.get('preferred_name', '')})
        mark_notified(user['user_id'], 'habit_reminder')