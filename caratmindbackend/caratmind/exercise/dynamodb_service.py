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

# save coping exercise recommendation
def save_exercise_recommendation(user_id: str, jrnl_id: str, mood_name: str, exercise: dict) -> dict:
    table = _get_user_exercise_table()
    item = {
        'uex_id': jrnl_id, # use jrnl ID - 1 to 1
        'user_id': user_id,
        'jrnl_id': jrnl_id,
        'mood_name': mood_name,
        'exc_name': exercise['exc_name'],
        'exercises': exercise,  
        'rec_timestamp': datetime.now(timezone.utc).isoformat(),
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