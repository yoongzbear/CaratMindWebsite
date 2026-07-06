
from datetime import datetime, timezone
import random
import uuid
from zoneinfo import ZoneInfo

import boto3
from boto3.dynamodb.conditions import Attr, Key

from caratmind import settings
from caratmind.datetime import today_local

def _get_habit_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_HABIT_TABLE)

def _get_user_habit_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USER_HABIT_TABLE)

# get all habit
def get_all_habit() -> list[dict]:
    table = _get_habit_table()
    items = []
    response = table.scan()
    items.extend(response.get("Items", []))

    while "LastEvaluatedKey" in response:
        response = table.scan(
            ExclusiveStartKey=response["LastEvaluatedKey"]
        )
        items.extend(response.get("Items", []))

    return items

# save habit
def save_user_habit(user_id: str, hab_id: str, action: str, status: str) -> dict:
    table = _get_user_habit_table()
    now = datetime.now(timezone.utc).isoformat() # timestamp
    item = {        
        'uhab_id': str(uuid.uuid4()), 
        'hab_id': hab_id,
        'uhab_action': action,
        'uhab_status': status,
        'uhab_date': today_local().isoformat(),
        'uhab_created_at': now,
        'uhab_updated_at': now,        
        'user_id': user_id        
    }
    table.put_item(Item=item)
    return item

# get user completed habit for current date 
def get_today_user_habit(user_id: str) -> list[dict]:
    table = _get_user_habit_table()
    today = today_local().isoformat()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id) & Attr('uhab_date').eq(today)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id) & Attr('uhab_date').eq(today)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

# select habit from current pool
def select_today_habit(user_id: str) -> dict | None:
    """
    Returns a random habit that the user hasn't marked completed/incomplete today.
    Returns None if every habit already has a completed/incomplete status today.
    """
    all_habits = get_all_habit()
    today_records = get_today_user_habit(user_id)

    # most recent based on uhab_updated_at (even with same hab_id)
    status_by_habit = {}
    for record in today_records:
        hab_id = record.get('hab_id')
        if hab_id not in status_by_habit or record['uhab_updated_at'] > status_by_habit[hab_id]['uhab_updated_at']:
            status_by_habit[hab_id] = record

    # habits with no record today or status is not 'completed' or 'incomplete'
    candidates = [
        habit for habit in all_habits
        if status_by_habit.get(habit['hab_id'], {}).get('uhab_status') not in ('completed', 'incomplete')
    ]

    if not candidates:
        return None

    # random
    return random.choice(candidates)

# delete habit records
def delete_all_user_habit(user_id: str) -> None:
    table = _get_user_habit_table()
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
            batch.delete_item(Key={'uhab_id': item['uhab_id']}) 