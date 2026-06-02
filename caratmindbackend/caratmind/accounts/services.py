import boto3
import base64
import hashlib
import hmac
import requests
from jose import jwt
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
        
        # Initialize Cognito client
        self.cognito_client = boto3.client('cognito-idp', region_name=self.region)
    
    def _calculate_secret_hash(self, username: str) -> str:
        """Calculate the secret hash required for Cognito operations."""
        message = username + self.client_id
        dig = hmac.new(
            key=self.client_secret.encode('UTF-8'),
            msg=message.encode('UTF-8'),
            digestmod=hashlib.sha256
        ).digest()
        return base64.b64encode(dig).decode()
    
    def get_authorization_url(self) -> str:
        """Generate the Cognito authorization URL."""
        return (
            f"{self.domain}/oauth2/authorize?"
            f"response_type=code&"
            f"client_id={self.client_id}&"
            f"redirect_uri={self.redirect_uri}&"
            f"scope=openid+email+profile"
        )
    
    def exchange_code_for_tokens(self, code: str) -> Optional[Dict[str, Any]]:
        """Exchange authorization code for tokens."""
        token_url = f"{self.domain}/oauth2/token"
        
        data = {
            'grant_type': 'authorization_code',
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'redirect_uri': self.redirect_uri,
        }
        
        response = requests.post(token_url, data=data)
        
        if response.status_code == 200:
            return response.json()
        return None
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode the JWT token."""
        try:
            # Get the JWT signing keys from Cognito
            keys_url = f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json"
            keys_response = requests.get(keys_url)
            keys = keys_response.json()['keys']
            
            # Decode the token
            decoded_token = jwt.decode(
                token,
                keys,
                algorithms=['RS256'],
                audience=self.client_id,
                issuer=f"https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}"
            )
            
            return decoded_token
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None
    
    def get_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user information using access token."""
        try:
            response = self.cognito_client.get_user(AccessToken=access_token)
            return response
        except Exception as e:
            print(f"Failed to get user info: {e}")
            return None
    
    def sign_out_user(self, access_token: str) -> bool:
        """Sign out user from Cognito."""
        try:
            self.cognito_client.global_sign_out(AccessToken=access_token)
            return True
        except Exception as e:
            print(f"Sign out failed: {e}")
            return False