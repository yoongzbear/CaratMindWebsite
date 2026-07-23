import uuid
from datetime import datetime, timedelta, timezone
from boto3.dynamodb.conditions import Attr
from botocore.exceptions import ClientError

import boto3
from django.conf import settings

def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_MOOD_TABLE)

# upload/update mood into db
def create_mood(jrnl_id: str, user_id: str, mood_result: dict) -> dict:
    table = _get_table()
    item = {
        'jrnl_id': jrnl_id,
        'mood_id': jrnl_id,
        'user_id': user_id,
        'mood_name': mood_result['mood_name'],
        'mood_confidence': str(mood_result['mood_confidence']),  
        'mood_explain': mood_result['mood_explain'],
        'mood_timestamp': datetime.now(timezone.utc).isoformat(),
        'mood_confirmed': None,
        'mood_corrected': None,
    }
    table.put_item(Item=item)
    return item

# update confirmed mood
def confirm_mood(mood_id: str) -> dict | None:
    table = _get_table()
    response = table.update_item(
        Key={'jrnl_id': mood_id},  
        UpdateExpression=(
            'SET mood_confirmed = :mood_confirmed'
        ),
        ExpressionAttributeValues={
            ':mood_confirmed': True,
        },
        ReturnValues='ALL_NEW',
    )
    return response.get('Attributes')

# update corrected mood
def corrected_mood(mood_id: str, correct_mood: str) -> dict | None:
    table = _get_table()
    response = table.update_item(
        Key={'jrnl_id': mood_id},  
        UpdateExpression=(
            'SET mood_confirmed = :mood_confirmed, mood_corrected = :mood_corrected'
        ),
        ExpressionAttributeValues={
            ':mood_confirmed': False,
            ':mood_corrected': correct_mood,
        },
        ReturnValues='ALL_NEW',
    )
    return response.get('Attributes')

# get mood info 
# filter using date 
def get_user_mood_on_date(user_id: str, date_str: str) -> list[dict]:
    table = _get_table()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id) & Attr('mood_timestamp').begins_with(date_str)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id) & Attr('mood_timestamp').begins_with(date_str)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# by ID
def get_mood_by_id(jrnl_id: str) -> dict | None:
    table = _get_table()
    response = table.get_item(Key={'jrnl_id': jrnl_id})
    return response.get('Item')

# get last 7 or N days moods
def get_user_recent_moods(user_id: str, days: int = 7, start_date: str | None = None, end_date: str | None = None) -> list[dict]:
    """
    If start_date/end_date (YYYY-MM-DD) are provided, use that range.
    Otherwise fall back to last `days` days from now.
    """
    table = _get_table()

    if start_date and end_date: 
        # end of end_date in UTC so the full day is included
        cutoff_start = f"{start_date}T00:00:00+00:00"
        cutoff_end = f"{end_date}T23:59:59+00:00"
        filter = (
            Attr('user_id').eq(user_id)
            & Attr('mood_timestamp').gte(cutoff_start)
            & Attr('mood_timestamp').lte(cutoff_end)
        )
    else:
        cutoff = (
            datetime.now(timezone.utc) - timedelta(days=days - 1)
        ).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        filter = Attr('user_id').eq(user_id) & Attr('mood_timestamp').gte(cutoff)

    response = table.scan(FilterExpression=filter)
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression = filter,
            ExclusiveStartKey = response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    items.sort(key=lambda i: i.get('mood_timestamp', ''), reverse=True)
    return items

# calculate number of days with negative mood
NEGATIVE_MOOD = {'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'}

def calc_negative_mood_streak(user_id: str) -> int:
    recent_moods = get_user_recent_moods(user_id, 7)  # 7 days

    # group by calendar date, take the latest mood per day
    by_date = {}
    for m in recent_moods:
        date_str = m['mood_timestamp'][:10]  
        if date_str not in by_date:  
            by_date[date_str] = m['mood_name']

    sorted_dates = sorted(by_date.keys(), reverse=True)
    streak = 0
    for date_str in sorted_dates:
        if by_date[date_str] in NEGATIVE_MOOD:
            streak += 1
        else:
            break

    return streak

# delete user mood records
def delete_all_user_mood(user_id: str) -> None:
    table = _get_table()
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

    with table.batch_writer() as batch:
        for item in items:
            batch.delete_item(Key={'jrnl_id': item['jrnl_id']}) 

def delete_mood_by_id(jrnl_id: str) -> None:
    table = _get_table()
    try:
        table.delete_item(Key={'jrnl_id': jrnl_id})
    except ClientError as e:
        print(f"DeleteItem failed on mood table: {e.response['Error']['Code']} - {e.response['Error']['Message']}")
        raise