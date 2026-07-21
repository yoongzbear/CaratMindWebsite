import boto3
from botocore.exceptions import ClientError

from caratmind import settings
from caratmind.datetime_utils import today_local
from boto3.dynamodb.conditions import Attr, Key

BADGE_MILESTONES = {7, 30, 60, 100}

def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USER_BADGE_TABLE)

# check then save badge
def save_badge(sub: str, badge_type: str, streak: int) -> str | None:
    if streak not in BADGE_MILESTONES:
        return None

    badge_id = f"{badge_type}_{streak}" # journal_7
    table = _get_table()

    try:
        table.put_item(
            Item={
                'user_id': sub,
                'badge_id': badge_id,
                'type': badge_type,
                'milestone': streak,
                'earned_at': today_local().isoformat(),
            },
            ConditionExpression='attribute_not_exists(badge_id)',
        )
        return badge_id
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return None
        raise

def get_user_badges(sub: str) -> list[str]:
    table = _get_table()
    response = table.query(KeyConditionExpression=(Key('user_id').eq(sub)))
    items = response.get('Items', [])
    return [item['badge_id'] for item in items]