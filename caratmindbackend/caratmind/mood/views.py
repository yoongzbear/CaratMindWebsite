from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from accounts.authentication import authenticate_bearer
from mood.dynamodb_service import get_mood_by_id

# mood by ID
@require_GET
def get_mood_view(request, jrnl_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    mood = get_mood_by_id(jrnl_id)

    if not mood:
        return JsonResponse({'error': 'Mood not found'}, status=404)
    if mood.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    return JsonResponse({**mood})