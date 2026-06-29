from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET

from accounts.authentication import authenticate_bearer
from mood.dynamodb_service import get_mood_by_id, get_user_recent_moods

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

NEGATIVE_MOOD = {'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'}
# negative mood streak
@require_GET
def negative_mood_streak_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    try:
        recent_moods = get_user_recent_moods(sub, 7) # 7 days
    except Exception as e:
        return JsonResponse({'error': f'Failed to load mood history: {e}'}, status=500)

    # group by calendar date, take the latest mood per day
    by_date = {}
    for m in recent_moods:
        date_str = m['mood_timestamp'][:10]  # 'YYYY-MM-DD'
        if date_str not in by_date:  # already sorted newest-first
            by_date[date_str] = m['mood_name']

    # count consecutive negative days, walking backward from today
    sorted_dates = sorted(by_date.keys(), reverse=True)
    streak = 0
    for date_str in sorted_dates:
        if by_date[date_str] in NEGATIVE_MOOD:
            streak += 1
        else:
            break

    return JsonResponse({'negative_streak_days': streak})