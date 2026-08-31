from dataclasses import dataclass
from typing import Optional

from .services import CognitoService

@dataclass
class CognitoPrincipal:
    claims: dict

    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def username(self) -> str:
        return (
            self.claims.get('username')
            or self.claims.get('cognito:username')
            or ''
        )

    @property
    def email(self) -> str:
        return self.claims.get('email', '')


def authenticate_bearer(request) -> Optional[CognitoPrincipal]:
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header[7:].strip()
    if not token:
        return None

    claims = CognitoService().verify_access_token(token)
    if not claims:
        return None

    return CognitoPrincipal(claims=claims)
