from datetime import datetime, timezone
import uuid

import boto3
from boto3.dynamodb.conditions import Attr
from caratmind import settings

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
        'uex_id': jrnl_id, # use jrnl ID - 1 to 1
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
        'uex_done_date': None
    }
    table.put_item(Item=item)
    return item

# recent exercises
def get_recent_exc_names(user_id: str, limit: int = 5) -> list[str]:
    table = _get_user_exercise_table()
    response = table.scan(FilterExpression=Attr('user_id').eq(user_id))
    items = response.get('Items', [])
    items.sort(key=lambda i: i.get('rec_timestamp', ''), reverse=True)

    names = []
    for item in items[:limit]:
        names.extend(item.get('exc_names', []))
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