from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt

from accounts.authentication import authenticate_bearer
from mood.dynamodb_service import LOCAL_TZ, _to_local_date, calc_negative_mood_streak, confirm_mood, corrected_mood, get_mood_by_id, get_user_recent_moods

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

# NEGATIVE_MOOD = {'anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'}
# negative mood streak
@require_GET
def negative_mood_streak_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    try:
        # recent_moods = get_user_recent_moods(sub, 7) # 7 days
        streak = calc_negative_mood_streak(sub)
    except Exception as e:
        return JsonResponse({'error': f'Failed to calculate negative mood streak: {e}'}, status=500)

    # # group by calendar date, take the latest mood per day
    # by_date = {}
    # for m in recent_moods:
    #     date_str = m['mood_timestamp'][:10]  # 'YYYY-MM-DD'
    #     if date_str not in by_date:  # already sorted newest-first
    #         by_date[date_str] = m['mood_name']

    # # count consecutive negative days, walking backward from today
    # sorted_dates = sorted(by_date.keys(), reverse=True)
    # streak = 0
    # for date_str in sorted_dates:
    #     if by_date[date_str] in NEGATIVE_MOOD:
    #         streak += 1
    #     else:
    #         break

    return JsonResponse({'negative_streak_days': streak})

# mood chart data
@require_GET
def mood_chart_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    # accept ?days=7 OR ?start_date=2026-06-01&end_date=2026-06-30
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    try:
        days = int(request.GET.get('days', 7))
    except ValueError:
        return JsonResponse({'error': 'Invalid days parameter'}, status=400)
    
    # validate custom range if provided
    if bool(start_date) != bool(end_date):
        return JsonResponse({'error': 'Provide both start_date and end_date'}, status=400)

    try:
        moods = get_user_recent_moods(sub, days=days, start_date=start_date, end_date=end_date)
    except Exception as e:
        return JsonResponse({'error': f'Failed to load mood chart data: {e}'}, status=500)

    # build the date range to display
    today = datetime.now(LOCAL_TZ).date()
    if start_date and end_date:
        start = date.fromisoformat(start_date)
        end = date.fromisoformat(end_date)
    else:
        end = today
        start = today - timedelta(days=days - 1)

    total_days = (end - start).days + 1
    date_range = [(start + timedelta(days=i)).isoformat() for i in range(total_days)]

    # count moods per day
    counts = defaultdict(lambda: defaultdict(int))  # counts[date][mood_name] += 1
    for m in moods:
        date_str = _to_local_date(m['mood_timestamp'])
        mood_name = m.get('mood_name')
        if mood_name:
            counts[date_str][mood_name] += 1

    all_moods = sorted({m.get('mood_name') for m in moods if m.get('mood_name')})
    chart_data = []
    for date_str in date_range:
        row = {'date': date_str}
        for mood in all_moods:
            row[mood] = counts[date_str].get(mood, 0)
        row['jrnl_ids'] = [
            m['jrnl_id'] for m in moods
            if _to_local_date(m['mood_timestamp']) == date_str and m.get('jrnl_id')
        ]
        chart_data.append(row)

    return JsonResponse({'chart_data': chart_data, 'moods': all_moods})

# get each mood per timestamp for scatter plot
@require_GET
def mood_scatter_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    try:
        days = int(request.GET.get('days', 30))
    except ValueError:
        return JsonResponse({'error': 'Invalid days parameter'}, status=400)

    if bool(start_date) != bool(end_date):
        return JsonResponse({'error': 'Provide both start_date and end_date'}, status=400)

    try:
        moods = get_user_recent_moods(sub, days=days, start_date=start_date, end_date=end_date)
    except Exception as e:
        return JsonResponse({'error': f'Failed to load mood scatter data: {e}'}, status=500)

    # one point per journal entry
    points = [
        {
            'jrnl_id': m.get('jrnl_id'),
            'mood_name': m.get('mood_name'),
            'mood_timestamp': m.get('mood_timestamp'),
        }
        for m in moods
        if m.get('mood_name')
    ]

    return JsonResponse({'points': points})

# update confirm mood
@csrf_exempt
@require_POST
def confirm_mood_view(request, jrnl_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    # make sure the mood belongs to the caller
    user_mood = get_mood_by_id(jrnl_id)
    if not user_mood:
        return JsonResponse({'error': 'User mood not found'}, status=404)
    if user_mood.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    # try:
    #     body = json.loads(request.body)
    # except json.JSONDecodeError:
    #     return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    # rating = body.get('rating')
    # if not rating or not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
    #     return JsonResponse({'error': 'Rating must be a number between 1 and 5'}, status=400)

    try:
        updated = confirm_mood(jrnl_id)
    except Exception as e:
        return JsonResponse({'error': f'Failed to save mood confirmation: {e}'}, status=500)

    # return JsonResponse(updated)
    return JsonResponse({
        "message": "Mood confirmed successfully.",
        "user_mood": updated,
    })

# update corrected mood
@csrf_exempt
@require_POST
def corrected_mood_view(request, jrnl_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    user_mood = get_mood_by_id(jrnl_id)
    if not user_mood:
        return JsonResponse({'error': 'User mood not found'}, status=404)
    if user_mood.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    submit_mood = body.get('corrected_mood')
    if not submit_mood:
        return JsonResponse({'error': 'Corrected mood must be submitted.'}, status=400)

    try:
        updated = corrected_mood(jrnl_id, submit_mood)
    except Exception as e:
        return JsonResponse({'error': f'Failed to save corrected mood: {e}'}, status=500)

    # return JsonResponse(updated)
    return JsonResponse({
        "message": "Corrected mood saved successfully.",
        "user_mood": updated,
    })