from datetime import datetime, timedelta, timezone
import logging
import uuid
from zoneinfo import ZoneInfo

import boto3
from boto3.dynamodb.conditions import Attr, Key
from accounts.dynamodb_service import get_user
from badge.dynamodb_service import save_badge
from caratmind import settings
from caratmind.datetime_utils import to_local_date_str, today_local
from notification.ses_service import send_notification

def _get_exercise_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_EXERCISE_TABLE)

def _get_user_exercise_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USER_EXERCISE_TABLE)

# all exercises
def get_all_exercises() -> list[dict]:
    table = _get_exercise_table()
    items = []
    response = table.scan()
    items.extend(response.get("Items", []))

    while "LastEvaluatedKey" in response:
        response = table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        items.extend(response.get("Items", []))

    return items

# get coping exercise by ID
def get_exercise_by_id(exc_id: str) -> dict | None:
    table = _get_exercise_table()
    response = table.get_item(Key={'exc_id': exc_id})
    return response.get('Item')

# coping exercises by mood
def get_exercises_for_mood(mood_name: str) -> list[dict]:
    """
    Knowledge-based lookup: exercises whose exc_mood list contains mood_name.
    Scan is fine at low volume; revisit with a GSI if the table grows large
    (e.g. a sparse mood->exercise mapping table, or DynamoDB Streams + cache).
    """
    table = _get_exercise_table()
    response = table.scan(
        FilterExpression=Attr('exc_mood').contains(mood_name)
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=Attr('exc_mood').contains(mood_name),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# default exercise if no candidate available
FALLBACK_EXC_NAME = "Basic Breathing Technique"
def get_default_exercise() -> dict | None:
    """
    Universal safe default when no mood-matched candidates exist.
    Looked up by name rather than hardcoded, so editing the row in
    DynamoDB is reflected automatically.
    """
    table = _get_exercise_table()
    response = table.scan(
        FilterExpression=Attr('exc_name').eq(FALLBACK_EXC_NAME)
    )
    items = response.get('Items', [])
    return items[0] if items else None

# save coping exercise recommendation
def create_exercise_recommendation(user_id: str, jrnl_id: str, exercise: dict) -> dict:
    table = _get_user_exercise_table()
    item = {
        'uex_id': jrnl_id, 
        'user_id': user_id,
        'jrnl_id': jrnl_id,
        'exc_id': exercise['exc_id'],
        # 'mood_name': mood_name,
        'exc_name': exercise['exc_name'],
        # 'exercises': exercise,  
        'uex_status': 'incomplete',
        'uex_rating': None,
        'uex_reason': None,
        'uex_created_at': datetime.now(timezone.utc).isoformat(),
        # 'uex_done_date': None
    }
    table.put_item(Item=item)
    return item

# recent exercises
def get_recent_exc_names(user_id: str, limit: int = 5) -> list[str]:
    table = _get_user_exercise_table()
    response = table.scan(FilterExpression=Attr('user_id').eq(user_id))
    items = response.get('Items', [])
    items.sort(key=lambda i: i.get('uex_created_at', ''), reverse=True)

    names = []
    for item in items[:limit]:
        if item.get('exc_name'):
            names.append(item['exc_name'])
    print(names)
    return names

# get user exercise by ID
def get_user_exercise_by_id(uex_id: str) -> dict | None:
    table = _get_user_exercise_table()
    response = table.get_item(Key={'jrnl_id': uex_id})
    return response.get('Item')

# user exercises by date
def get_user_exercises_on_date(user_id: str, date_str: str) -> list[dict]:
    """
    date_str is a 'YYYY-MM-DD' string. Matches entries whose uex_created_at
    (an ISO timestamp) starts with that date.
    """
    table = _get_user_exercise_table()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id) & Attr('uex_created_at').begins_with(date_str)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id) & Attr('uex_created_at').begins_with(date_str)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# get incomplete exercise - created but incomplete status with NULL incompletion reason 
def get_incomplete_exercise_on_date(user_id: str, date_str: str) -> list[dict]:
    table = _get_user_exercise_table()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id) 
            & Attr('uex_created_at').begins_with(date_str)
            & Attr('uex_status').eq('incomplete')
            & Attr('uex_reason').eq(None)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id) 
                & Attr('uex_created_at').begins_with(date_str)
                & Attr('uex_status').eq('incomplete')
                & Attr('uex_reason').eq(None)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# update rating 
def update_user_exercise_rating(uex_id: str, rating: int) -> dict | None:
    table = _get_user_exercise_table()
    response = table.update_item(
        Key={'jrnl_id': uex_id},  
        UpdateExpression=(
            'SET uex_status = :status, uex_rating = :rating, uex_done_date = :done_date'
        ),
        ExpressionAttributeValues={
            ':status': 'completed',
            ':rating': rating,
            ':done_date': datetime.now(timezone.utc).isoformat(),
        },
        ReturnValues='ALL_NEW',
    )
    return response.get('Attributes')

# update reason 
def update_user_exercise_reason(uex_id: str, reason: str) -> dict | None:
    table = _get_user_exercise_table()
    response = table.update_item(
        Key={'jrnl_id': uex_id},  
        UpdateExpression=(
            'SET uex_reason = :reason'
        ),
        ExpressionAttributeValues={
            ':reason': reason,
        },
        ReturnValues='ALL_NEW',
    )
    return response.get('Attributes')

# days completed exercise for streak
def get_completed_dates_for_user(sub: str, start_date: str, end_date: str) -> set[str]:
    table = _get_user_exercise_table()
    response = table.query(
        IndexName='user_id-uex_done_date-index',
        KeyConditionExpression=(
            Key('user_id').eq(sub) & Key('uex_done_date').between(start_date, end_date)
        ),
    )
    items = response.get('Items', [])
    return {to_local_date_str(item['uex_done_date']) for item in items}

logger = logging.getLogger(__name__)

def calc_exc_streak(sub: str) -> dict:
    # today_local = datetime.fromisoformat(today_local_str()).date()
    today = today_local()
    start_date = (today - timedelta(days=365)).isoformat()
    end_date = (today + timedelta(days=1)).isoformat() 

    completed_dates = get_completed_dates_for_user(sub, start_date, end_date)

    streak = 0
    cursor = today
    completed_today = today.isoformat() in completed_dates

    if not completed_today:
        cursor = cursor - timedelta(days=1)

    while cursor.isoformat() in completed_dates:
        streak += 1
        cursor -= timedelta(days=1)

    new_badge = save_badge(sub, 'exercise', streak)

    if new_badge:
        try:
            user = get_user(sub)
            send_notification(user['email'], 'new_badge', {
                'name': user.get('name', ''),
                'streak': streak,
                'type': 'exercise',
            })
        except Exception:
            logger.exception('coping exercise badge email failed')

    return {
        'streak': streak,
        'completed_today': completed_today,
        'new_badge': new_badge
    }

# delete user exercise records
def delete_all_user_exercise(user_id: str) -> None:
    table = _get_user_exercise_table()
    response = table.scan(
        FilterExpression=Attr('user_id').eq(user_id)
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=Attr('user_id').eq(user_id),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    # with table.batch_writer() as batch:
    #     for item in items:
    #         # batch.delete_item(Key={'uex_id': item['uex_id']}) 
    #         batch.delete_item(Key={'jrnl_id': item['jrnl_id']}) 
    for item in items:
        table.delete_item(
            Key={
                'jrnl_id': item['jrnl_id']
            }
        )