
from datetime import datetime, timezone

import boto3
from boto3.dynamodb.conditions import Attr, Key

from caratmind import settings


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
def save_user_habit(user_id: str, habit: dict) -> dict:
    table = _get_user_habit_table()
    item = {
        # TODO: check the values
        'uhab_id': 'string', # uuid
        'hab_id': habit['hab_id'],
        'uhab_action': habit['uhab_action'],
        'uhab_created_at': datetime.now(timezone.utc).isoformat(),
        'uhab_updated_at': datetime.now(timezone.utc).isoformat(),
        'uhab_status': habit['uhab_status'],
        'user_id': user_id        
    }
    table.put_item(Item=item)
    return item

# get user completed habit 
def get_user_habit(user_id: str) -> list[dict]:
    table = _get_user_habit_table()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items