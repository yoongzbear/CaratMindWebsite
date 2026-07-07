import base64
import hashlib
import hmac
import boto3
import requests
from jose import jwt, jwk
from jose.exceptions import JWTError
from django.conf import settings
from typing import Optional, Dict, Any

class CognitoService:
    def __init__(self):
        self.user_pool_id = settings.AWS_COGNITO_USER_POOL_ID
        self.client_id = settings.AWS_COGNITO_CLIENT_ID
        self.client_secret = settings.AWS_COGNITO_CLIENT_SECRET
        self.region = settings.AWS_COGNITO_REGION
        self.domain = settings.COGNITO_DOMAIN
        self.redirect_uri = settings.COGNITO_REDIRECT_URI
        self.issuer = (
            f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}"
        )
        self._jwks: Optional[list] = None

    def _get_client(self):
        return boto3.client('cognito-idp', region_name=self.region)

    def _calculate_secret_hash(self, username: str) -> str | None:
        if not self.client_secret:
            return None
        message = username + self.client_id
        dig = hmac.new(
            key=self.client_secret.encode('UTF-8'),
            msg=message.encode('UTF-8'),
            digestmod=hashlib.sha256,
        ).digest()
        return base64.b64encode(dig).decode()

    def _get_jwks(self) -> list:
        if self._jwks is None:
            keys_url = f"{self.issuer}/.well-known/jwks.json"
            keys_response = requests.get(keys_url, timeout=10)
            keys_response.raise_for_status()
            self._jwks = keys_response.json()['keys']
        return self._jwks

    def _decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            headers = jwt.get_unverified_header(token)
            kid = headers.get('kid')
            if not kid:
                return None

            key_data = next((k for k in self._get_jwks() if k['kid'] == kid), None)
            if not key_data:
                return None

            public_key = jwk.construct(key_data)
            return jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                issuer=self.issuer,
                options={'verify_aud': False},
            )
        except (JWTError, requests.RequestException, StopIteration) as e:
            print(f"Token verification failed: {e}")
            return None

    def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        claims = self._decode_token(token)
        if not claims:
            return None

        # token_use = claims.get('token_use')
        if claims.get('token_use') != 'access':
            return None

        if claims.get('client_id') != self.client_id:
            return None

        return claims

    def verify_id_token(self, token: str) -> Optional[Dict[str, Any]]:
        claims = self._decode_token(token)
        if not claims:
            return None

        if claims.get('token_use') != 'id':
            return None

        # aud = claims.get('aud')
        if claims.get('aud') != self.client_id:
            return None

        return claims
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify access token first, then ID token."""
        return self.verify_access_token(token) or self.verify_id_token(token)
    
    def get_authorization_url(self) -> str:
        return (
            f"{self.domain}/oauth2/authorize?"
            f"response_type=code&"
            f"client_id={self.client_id}&"
            f"redirect_uri={self.redirect_uri}&"
            f"scope=openid+email+profile"
        )
    
    def exchange_code_for_tokens(self, code: str) -> Optional[Dict[str, Any]]:
        token_url = f"{self.domain}/oauth2/token"
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'redirect_uri': self.redirect_uri,
        }
        response = requests.post(token_url, data=data, timeout=10)
        if response.status_code == 200:
            return response.json()
        return None
    
    def admin_update_preferred_username(self, username: str, preferred_username: str) -> None:
        import boto3
        client = boto3.client('cognito-idp', region_name=self.region)
        client.admin_update_user_attributes(
            UserPoolId=self.user_pool_id,
            Username=username,
            UserAttributes=[
                {'Name': 'preferred_username', 'Value': preferred_username},
            ],
        )

    # register
    def sign_up_user(self, username: str, password: str, email: str, preferred_username: str) -> dict:
        client = self._get_client()
        username = username.strip()
        kwargs = {
            'ClientId': self.client_id,
            'Username': username,
            'Password': password,
            'UserAttributes': [
                {'Name': 'email', 'Value': email.strip()},
                {'Name': 'preferred_username', 'Value': preferred_username.strip()},
            ],
        }
        secret_hash = self._calculate_secret_hash(username)
        if secret_hash:
            kwargs['SecretHash'] = secret_hash

        response = client.sign_up(**kwargs)
        return {
            'user_confirmed': response.get('UserConfirmed', False),
            'user_sub': response.get('UserSub', ''),
        }
    
    # verification
    def confirm_sign_up(self, username: str, confirmation_code: str) -> None:
        client = self._get_client()
        username = username.strip()
        kwargs = {
            'ClientId': self.client_id,
            'Username': username,
            'ConfirmationCode': confirmation_code.strip(),
        }
        secret_hash = self._calculate_secret_hash(username)
        if secret_hash:
            kwargs['SecretHash'] = secret_hash
        client.confirm_sign_up(**kwargs)

    def resend_confirmation_code(self, username: str) -> None:
        client = self._get_client()
        username = username.strip()
        kwargs = {'ClientId': self.client_id, 'Username': username}
        secret_hash = self._calculate_secret_hash(username)
        if secret_hash:
            kwargs['SecretHash'] = secret_hash
        client.resend_confirmation_code(**kwargs)

    def get_user_status(self, username: str) -> dict:
        client = self._get_client()
        try:
            response = client.admin_get_user(
                UserPoolId=self.user_pool_id,
                Username=username,
            )
            sub = next(
                (a['Value'] for a in response.get('UserAttributes', []) if a['Name'] == 'sub'),
                None,
            )
            return {
                'exists': True,
                'confirmed': response.get('UserStatus') == 'CONFIRMED',
                'sub': sub,
            }
        except client.exceptions.UserNotFoundException:
            return {'exists': False, 'confirmed': False, 'sub': None}
        
    def find_confirmed_email(self, email: str) -> bool:
        client = self._get_client()
        response = client.list_users(
            UserPoolId=self.user_pool_id,
            Filter=f'email = "{email.strip().lower()}"',
        )
        return any(u.get('UserStatus') == 'CONFIRMED' for u in response.get('Users', []))
    
    # log in
    def sign_in_with_password(self, username: str, password: str) -> dict:
        client = self._get_client()
        username = username.strip()
        params = {'USERNAME': username, 'PASSWORD': password}
        secret_hash = self._calculate_secret_hash(username)
        if secret_hash:
            params['SECRET_HASH'] = secret_hash

        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            ClientId= self.client_id,
            AuthParameters=params,
        )
        result = response.get('AuthenticationResult', {})
        return {
            'access_token': result.get('AccessToken'),
            'id_token': result.get('IdToken'),
            'refresh_token': result.get('RefreshToken'),
            'expires_in': result.get('ExpiresIn', 3600),
        }
    
    def refresh_tokens(self, username: str, refresh_token: str) -> dict:
        client = self._get_client()
        params = {'REFRESH_TOKEN': refresh_token}
        secret_hash = self._calculate_secret_hash(username)
        if secret_hash:
            params['SECRET_HASH'] = secret_hash

        response = client.initiate_auth(
            AuthFlow='REFRESH_TOKEN_AUTH',
            ClientId=self.client_id,
            AuthParameters=params,
        )
        result = response.get('AuthenticationResult', {})
        return {
            'access_token': result.get('AccessToken'),
            'id_token': result.get('IdToken'),
            'refresh_token': refresh_token,
            'expires_in': result.get('ExpiresIn', 3600),
        }

    # log out
    def sign_out_user(self, access_token: str) -> bool:
        try:
            client = self._get_client()
            client.global_sign_out(AccessToken=access_token)
            return True
        except Exception as e:
            print(f"Sign out failed: {e}")
            return False
        
    def get_user_profile(self, access_token: str) -> dict:
        client = self._get_client()
        response = client.get_user(AccessToken=access_token)
        attrs = {a['Name']: a['Value'] for a in response.get('UserAttributes', [])}
        return {
            'username': response.get('Username', ''),
            'email': attrs.get('email'),
            'preferred_username': attrs.get('preferred_username'),
        }
    
    @staticmethod
    def map_cognito_error(error: Exception) -> str:
        error_code = getattr(error, 'response', {}).get('Error', {}).get('Code')
        name = error_code or error.__class__.__name__
        mapping = {
            'NotAuthorizedException': 'Incorrect username or email or password.',
            'UserNotConfirmedException': 'Please confirm your email before logging in.',
            'UsernameExistsException': 'An account with this username or email already exists.',
            'InvalidPasswordException': 'Password does not meet security requirements.',
            'CodeMismatchException': 'Invalid verification code.',
            'ExpiredCodeException': 'Verification code has expired. Please request a new one.',
            'TooManyRequestsException': 'Too many attempts. Please wait and try again.',
            'LimitExceededException': 'Too many attempts. Please wait and try again.',
        }
        return mapping.get(name, 'Something went wrong. Please try again.')
