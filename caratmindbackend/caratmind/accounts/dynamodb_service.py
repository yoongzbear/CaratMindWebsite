import boto3
from botocore.exceptions import ClientError
from django.conf import settings


def _get_table():
    resource = boto3.resource('dynamodb', region_name=settings.DYNAMODB_REGION)
    return resource.Table(settings.DYNAMODB_USERS_TABLE)

# add record into USER table
def create_user_if_not_exists(user_id: str, username: str, email: str, preferred_name: str) -> bool:
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
                'username': username,
                'user_email': email,
                'preferred_name': preferred_name,
                'user_complete_onboarding': False,
                'user_theme': 'light',
                'notification_pref': {
                    'journal_reminder': True, 
                    'exercise_reminder': True, 
                    'mood_helpline': True, 
                    'habit_reminder': True,
                    'habit_summary': True, 
                    'new_badge' : True
                }
            },
            ConditionExpression='attribute_not_exists(user_id)',
        )
        return True
    except ClientError as e:
        if e.response.get('Error', {}).get('Code') == 'ConditionalCheckFailedException':
            return False
        raise

# update name 
def update_preferred_name(user_id: str, preferred_name: str):
    table = _get_table()

    table.update_item(
        Key={
            'user_id': user_id,
        },
        UpdateExpression='SET preferred_name = :name',
        ExpressionAttributeValues={':name': preferred_name},
        ConditionExpression='attribute_exists(user_id)',
    )

# update onboarding completion
def update_onboarding(user_id: str, onboardingDone: bool):
    table = _get_table()

    table.update_item(
        Key={
            'user_id': user_id,
        },
        UpdateExpression='SET user_complete_onboarding = :user_complete_onboarding',
        ExpressionAttributeValues={':user_complete_onboarding': onboardingDone},
        ConditionExpression='attribute_exists(user_id)',
    )

# update theme
def update_theme(user_id: str, theme: str):
    table = _get_table()

    table.update_item(
        Key={
            'user_id': user_id,
        },
        UpdateExpression='SET user_theme = :theme',
        ExpressionAttributeValues={':theme': theme},
        ConditionExpression='attribute_exists(user_id)',
    )

def get_user(user_id: str) -> dict | None:
    table = _get_table()
    response = table.get_item(Key={'user_id': user_id})
    return response.get('Item')

# delete user record
def delete_user_record(user_id: str) -> None:
    table = _get_table()
    table.delete_item(Key={'user_id': user_id})

def update_email_preference(user_id: str, prefs: dict) -> dict:
    table = _get_table()

    response = table.update_item(
        Key={
            'user_id': user_id,
        },
        UpdateExpression='SET notification_pref = :prefs',
        ExpressionAttributeValues={':prefs': prefs},
        ConditionExpression='attribute_exists(user_id)',
        ReturnValues='ALL_NEW'
    )
    return response.get('Attributes', {})