from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from accounts.authentication import authenticate_bearer
from badge.dynamodb_service import get_user_badges
# Create your views here.
@require_GET
def get_user_badges_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    sub = principal.claims.get('sub')
    badge_ids = get_user_badges(sub)

    return JsonResponse({'badges': badge_ids})