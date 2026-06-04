import base64
import hashlib
import hmac
import requests
from jose import jwt, jwk
from jose.exceptions import JWTError
from django.conf import settings
from typing import Optional, Dict, Any

class CognitoService:
    def __init__(self):
        self.user_pool_id = settings.AWS_COGNITO_USER_POOL_ID
        self.client_id = settings.AWS_COGNITO_APP_CLIENT_ID
        self.client_secret = settings.AWS_COGNITO_APP_CLIENT_SECRET
        self.region = settings.AWS_COGNITO_REGION
        self.domain = settings.COGNITO_DOMAIN
        self.redirect_uri = settings.COGNITO_REDIRECT_URI
        self.issuer = (
            f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}"
        )
        self._jwks: Optional[list] = None

    def _calculate_secret_hash(self, username: str) -> str:
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

        token_use = claims.get('token_use')
        if token_use != 'access':
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

        aud = claims.get('aud')
        if aud != self.client_id:
            return None

        return claims

    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify access token first, then ID token."""
        return self.verify_access_token(token) or self.verify_id_token(token)

    def sign_out_user(self, access_token: str) -> bool:
        try:
            import boto3
            client = boto3.client('cognito-idp', region_name=self.region)
            client.global_sign_out(AccessToken=access_token)
            return True
        except Exception as e:
            print(f"Sign out failed: {e}")
            return False

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
