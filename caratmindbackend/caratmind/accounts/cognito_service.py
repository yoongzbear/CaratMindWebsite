import base64
import hashlib
import hmac

import boto3

from caratmind import settings

def map_cognito_error(error: Exception) -> str:
    name = error.__class__.__name__
    mapping = {
        'NotAuthorizedException': 'Incorrect username/email or password.',
        'UserNotConfirmedException': 'Please confirm your email before signing in.',
        'UsernameExistsException': 'An account with this username or email already exists.',
        'InvalidPasswordException': 'Password does not meet security requirements.',
        'CodeMismatchException': 'Invalid verification code.',
        'ExpiredCodeException': 'Verification code has expired. Request a new one.',
        'TooManyRequestsException': 'Too many attempts. Please wait and try again.',
        'LimitExceededException': 'Too many attempts. Please wait and try again.',
        'UserNotFoundException': 'Account not found.',
    }
    return mapping.get(name, 'Something went wrong. Please try again.')