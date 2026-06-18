import boto3
from botocore.exceptions import ClientError
from django.conf import settings


def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USERS_TABLE)

# add record into USER table
def create_user_if_not_exists(user_id: str, email: str, preferred_name: str) -> bool:
    """
    Creates a new user record in DynamoDB keyed by Cognito sub.
    Returns True if created, False if a record already existed (idempotent —
    safe to call again on retries).
    """
    table = _get_table()
    try:
        table.put_item(
            Item={
                'user_id': user_id,
                'user_email': email,
                'preferred_name': preferred_name,
                'user_complete_onboarding': False,
            },
            ConditionExpression='attribute_not_exists(user_id)',
        )
        return True
    except ClientError as e:
        if e.response.get('Error', {}).get('Code') == 'ConditionalCheckFailedException':
            return False
        raise