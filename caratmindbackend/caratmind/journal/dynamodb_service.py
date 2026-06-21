import boto3
from django.conf import settings


def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_JOURNAL_TABLE)


def create_journal_entry(item: dict) -> None:
    table = _get_table()
    table.put_item(Item=item)