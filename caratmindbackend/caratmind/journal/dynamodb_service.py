import boto3
from django.conf import settings
from boto3.dynamodb.conditions import Attr

def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_JOURNAL_TABLE)

def create_journal_entry(item: dict) -> None:
    table = _get_table()
    table.put_item(Item=item)

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