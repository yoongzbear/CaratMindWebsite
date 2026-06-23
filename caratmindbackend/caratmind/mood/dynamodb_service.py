import uuid
from datetime import datetime, timezone

import boto3
from django.conf import settings

def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_MOOD_TABLE)

# upload mood into db
def create_mood_entry(jrnl_id: str, user_id: str, mood_result: dict) -> dict:
    table = _get_table()
    item = {
        'mood_id': str(uuid.uuid4()),
        'jrnl_id': jrnl_id,
        'user_id': user_id,
        'mood_name': mood_result['mood_name'],
        'mood_confidence': str(mood_result['mood_confidence']),  # Decimal-safe
        'mood_explain': mood_result['mood_explain'],
        'mood_timestamp': datetime.now(timezone.utc).isoformat(),
    }
    table.put_item(Item=item)
    return item

# update mood in db - when user edit their journal entry 