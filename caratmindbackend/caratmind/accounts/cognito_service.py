import base64
import hashlib
import hmac

import boto3

from caratmind import settings

# def _get_client():
#     return boto3.client('cognito-idp', region_name=settings.AWS_COGNITO_REGION)

# def _compute_secret_hash(username: str) -> str | None:
#     # client_secret = settings.AWS_COGNITO_CLIENT_SECRET
#     # client_id = settings.AWS_COGNITO_CLIENT_ID
#     # if not client_secret:
#     #     return None
#     # message = username + client_id
#     dig = hmac.new(
#         client_secret.encode('utf-8'),
#         message.encode('utf-8'),
#         hashlib.sha256,
#     ).digest()
#     return base64.b64encode(dig).decode()

# def sign_up_user(username: str, password: str, email: str, preferred_username: str) -> dict:
#     client = _get_client()
#     username = username.strip()
#     kwargs = {
#         'ClientId': settings.AWS_COGNITO_CLIENT_ID,
#         'Username': username,
#         'Password': password,
#         'UserAttributes': [
#             {'Name': 'email', 'Value': email.strip()},
#             {'Name': 'preferred_username', 'Value': preferred_username.strip()},
#         ],
#     }
#     secret_hash = _compute_secret_hash(username)
#     if secret_hash:
#         kwargs['SecretHash'] = secret_hash

#     response = client.sign_up(**kwargs)
#     return {
#         'user_confirmed': response.get('UserConfirmed', False),
#         'user_sub': response.get('UserSub', ''),
#     }

# def confirm_sign_up(username: str, confirmation_code: str) -> None:
#     client = _get_client()
#     username = username.strip()
#     kwargs = {
#         'ClientId': settings.AWS_COGNITO_CLIENT_ID,
#         'Username': username,
#         'ConfirmationCode': confirmation_code.strip(),
#     }
#     secret_hash = _compute_secret_hash(username)
#     if secret_hash:
#         kwargs['SecretHash'] = secret_hash
#     client.confirm_sign_up(**kwargs)

# def resend_confirmation_code(username: str) -> None:
#     client = _get_client()
#     username = username.strip()
#     kwargs = {'ClientId': settings.AWS_COGNITO_CLIENT_ID, 'Username': username}
#     secret_hash = _compute_secret_hash(username)
#     if secret_hash:
#         kwargs['SecretHash'] = secret_hash
#     client.resend_confirmation_code(**kwargs)

# def get_user_status(username: str) -> dict:
#     client = _get_client()
#     try:
#         response = client.admin_get_user(
#             UserPoolId=settings.AWS_COGNITO_USER_POOL_ID,
#             Username=username,
#         )
#         sub = next(
#             (a['Value'] for a in response.get('UserAttributes', []) if a['Name'] == 'sub'),
#             None,
#         )
#         return {
#             'exists': True,
#             'confirmed': response.get('UserStatus') == 'CONFIRMED',
#             'sub': sub,
#         }
#     except client.exceptions.UserNotFoundException:
#         return {'exists': False, 'confirmed': False, 'sub': None}

# def find_confirmed_email(self, email: str) -> bool:
#     client = _get_client()
#     response = client.list_users(
#         UserPoolId=settings.AWS_COGNITO_USER_POOL_ID,
#         Filter=f'email = "{email.strip().lower()}"',
#     )
#     return any(u.get('UserStatus') == 'CONFIRMED' for u in response.get('Users', []))

# def sign_in_with_password(username: str, password: str) -> dict:
#     client = _get_client()
#     username = username.strip()
#     params = {'USERNAME': username, 'PASSWORD': password}
#     secret_hash = _compute_secret_hash(username)
#     if secret_hash:
#         params['SECRET_HASH'] = secret_hash

#     response = client.initiate_auth(
#         AuthFlow='USER_PASSWORD_AUTH',
#         ClientId=settings.AWS_COGNITO_CLIENT_ID,
#         AuthParameters=params,
#     )
#     result = response.get('AuthenticationResult', {})
#     return {
#         'access_token': result.get('AccessToken'),
#         'id_token': result.get('IdToken'),
#         'refresh_token': result.get('RefreshToken'),
#         'expires_in': result.get('ExpiresIn', 3600),
#     }

# def refresh_tokens(username: str, refresh_token: str) -> dict:
#     client = _get_client()
#     params = {'REFRESH_TOKEN': refresh_token}
#     secret_hash = _compute_secret_hash(username)
#     if secret_hash:
#         params['SECRET_HASH'] = secret_hash

#     response = client.initiate_auth(
#         AuthFlow='REFRESH_TOKEN_AUTH',
#         ClientId=settings.AWS_COGNITO_CLIENT_ID,
#         AuthParameters=params,
#     )
#     result = response.get('AuthenticationResult', {})
#     return {
#         'access_token': result.get('AccessToken'),
#         'id_token': result.get('IdToken'),
#         'refresh_token': refresh_token,
#         'expires_in': result.get('ExpiresIn', 3600),
#     }

# def sign_out() -> None: 
#     client = _get_client()
#     try: 


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
    }
    return mapping.get(name, 'Something went wrong. Please try again.')