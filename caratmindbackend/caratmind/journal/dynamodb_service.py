from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import boto3
from django.conf import settings
from boto3.dynamodb.conditions import Attr, Key

from caratmind.datetime import to_local_date_str

def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_JOURNAL_TABLE)

def create_journal_entry(item: dict) -> None:
    table = _get_table()
    table.put_item(Item=item)

# all user journal entries
def get_all_entry_user(user_id: str) -> dict | None:
    table = _get_table()
    response = table.scan(FilterExpression=(Attr('user_id').eq(user_id)))
    items = response.get('Items', [])
    while 'LastEvaluatedKey' in response:
        response = table.scan(FilterExpression=(Attr('user_id').eq(user_id)))
        items.extend(response.get('Items', []))

    return items

# filter using date 
def get_entries_for_user_on_date(user_id: str, date_str: str) -> list[dict]:
    """
    date_str is a 'YYYY-MM-DD' string. Matches entries whose jrnl_created_at
    (an ISO timestamp) starts with that date.
    """
    table = _get_table()
    response = table.scan(
        FilterExpression=(
            Attr('user_id').eq(user_id) & Attr('jrnl_created_at').begins_with(date_str)
        )
    )
    items = response.get('Items', [])

    while 'LastEvaluatedKey' in response:
        response = table.scan(
            FilterExpression=(
                Attr('user_id').eq(user_id) & Attr('jrnl_created_at').begins_with(date_str)
            ),
            ExclusiveStartKey=response['LastEvaluatedKey'],
        )
        items.extend(response.get('Items', []))

    return items

def get_entry_by_id(jrnl_id: str) -> dict | None:
    table = _get_table()
    response = table.get_item(Key={'jrnl_id': jrnl_id})
    return response.get('Item')

# update entry
def update_journal_entry(
    jrnl_id: str,
    jrnl_preview: str,
    jrnl_status: str,
) -> None:
    table = _get_table()

    now = datetime.now(timezone.utc).isoformat()

    update_expr = """
        SET jrnl_preview = :preview,
            jrnl_updated_at = :updated_at,
            jrnl_status = :status
    """

    values = {
        ':preview': jrnl_preview,
        ':updated_at': now,
        ':status': jrnl_status,
    }

    if jrnl_status == 'submitted':
        update_expr += ", jrnl_submitted_at = :submitted_at"
        values[':submitted_at'] = now

    table.update_item(
        Key={'jrnl_id': jrnl_id},
        UpdateExpression=update_expr,
        ExpressionAttributeValues=values,
    )

# update mood id, mood name, uex id, exc name
def update_journal_mood_exc(jrnl_id: str, mood_id: str, mood_name: str, uex_id: str, exc_name: str) -> None:
    table = _get_table()
    table.update_item(
        Key={'jrnl_id': jrnl_id},
        UpdateExpression="SET mood_id = :mood_id, mood_name = :mood_name, uex_id = :uex_id, exc_name = :exc_name", 
        ExpressionAttributeValues={
            ':mood_id': mood_id,
            ':mood_name': mood_name,
            ':uex_id': uex_id,
            ':exc_name': exc_name
        },
    )

# get journal streak
def get_user_journal_dates_(sub: str, start_date: str, end_date: str) -> list[str]:
    table = _get_table()
    response = table.query(
        IndexName='user_id-jrnl_created_at-index',
        KeyConditionExpression=(
            Key('user_id').eq(sub) & Key('jrnl_created_at').between(start_date, end_date)
        ),
        FilterExpression=Attr('jrnl_status').eq("submitted"),
    )
    items = response.get('Items', [])
    return {to_local_date_str(item['jrnl_created_at']) for item in items}

def calc_journal_streak(sub: str) -> dict:
    today_local = datetime.now(ZoneInfo('Asia/Kuala_Lumpur')).date()
    start_date = (today_local - timedelta(days=365)).isoformat()
    end_date = (today_local + timedelta(days=1)).isoformat()  

    submitted_dates = get_user_journal_dates_(sub, start_date, end_date)    

    streak = 0
    cursor = today_local
    submitted_today = today_local.isoformat() in submitted_dates

    if not submitted_today:
        cursor = cursor - timedelta(days=1)

    while cursor.isoformat() in submitted_dates:
        streak += 1
        cursor -= timedelta(days=1)

    return {
        'streak': streak,
        'submitted_today': submitted_today,
    }

# delete user journal entries
def delete_all_user_entries(user_id: str) -> list[dict]:
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

    return items