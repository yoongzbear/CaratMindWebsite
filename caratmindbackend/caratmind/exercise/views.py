import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from accounts.authentication import authenticate_bearer
from exercise.dynamodb_service import calc_exc_streak, get_all_exercises, get_exercise_by_id, get_user_exercise_by_id, get_user_exercises_on_date, update_user_exercise_rating, update_user_exercise_reason

# retrieve coping exercises
@require_GET
def list_exercises_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    try:
        # entries = get_entries_for_user_on_date(sub, date_str)
        exercises = get_all_exercises()
    except Exception as e:
        return JsonResponse({'error': f'Failed to load exercises: {e}'}, status=500)

    # alphabetical order
    exercises.sort(key=lambda e: e.get('exc_name', '').lower())

    return JsonResponse({'exercises': exercises})

# by ID
@require_GET
def get_exercise_view(request, exc_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    # sub = principal.claims.get('sub')
    exercise = get_exercise_by_id(exc_id)

    if not exercise:
        return JsonResponse({'error': 'Exercise not found'}, status=404)

    # try:
    #     full_text = get_entry_text(entry['jrnl_entry_key'])
    # except Exception as e:
    #     return JsonResponse({'error': f'Failed to load entry text: {e}'}, status=500)

    return JsonResponse(exercise)

# retrieve user exercise by ID
@require_GET
def get_user_exercise_view(request, uex_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    # sub = principal.claims.get('sub')
    user_exercise = get_user_exercise_by_id(uex_id)

    if not user_exercise:
        return JsonResponse({'error': 'User coping exercise not found'}, status=404)

    exc_id = user_exercise.get('exc_id')
    exercise = get_exercise_by_id(exc_id) if exc_id else None

    response_data = {
        **user_exercise,
        **exercise,  
    }

    return JsonResponse(response_data)
    # try:
    #     full_text = get_entry_text(entry['jrnl_entry_key'])
    # except Exception as e:
    #     return JsonResponse({'error': f'Failed to load entry text: {e}'}, status=500)

    # return JsonResponse(user_exercise)

# retrieve all user exercises by date
@require_GET
def list_user_exercises_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    date_str = request.GET.get('date')  # 'YYYY-MM-DD'
    if not date_str:
        return JsonResponse({'error': 'date query param is required'}, status=400)

    # get user exercises
    try:
        user_exercises = get_user_exercises_on_date(sub, date_str)
    except Exception as e:
        return JsonResponse({'error': f'Failed to load coping exercises: {e}'}, status=500)

    # get exercise info
    exercises = []
    for uex in user_exercises:
        exc_id = uex.get('exc_id')
        exercise = get_exercise_by_id(exc_id) if exc_id else None
        exercises.append({
            **(exercise or {}),  
            **uex,               
        })

    # most recent first
    exercises.sort(key=lambda e: e.get('uex_created_at', ''), reverse=True)

    return JsonResponse({'exercises': exercises})

# update rating
@csrf_exempt
@require_POST
def rating_user_exercise_view(request, uex_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    # make sure this exercise record belongs to the caller
    user_exercise = get_user_exercise_by_id(uex_id)
    if not user_exercise:
        return JsonResponse({'error': 'User coping exercise not found'}, status=404)
    if user_exercise.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    rating = body.get('rating')
    if not rating or not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
        return JsonResponse({'error': 'Rating must be a number between 1 and 5'}, status=400)

    try:
        updated = update_user_exercise_rating(uex_id, rating)
    except Exception as e:
        return JsonResponse({'error': f'Failed to save rating: {e}'}, status=500)

    # return JsonResponse(updated)
    return JsonResponse({
        "message": "Rating saved successfully.",
        "user_exercise": updated,
    })

# update incompletion reason
@csrf_exempt
@require_POST
def reason_user_exercise_view(request, uex_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    # make sure this exercise record belongs to the caller
    user_exercise = get_user_exercise_by_id(uex_id)
    if not user_exercise:
        return JsonResponse({'error': 'User coping exercise not found'}, status=404)
    if user_exercise.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    reason = body.get('reason')
    if not reason:
        return JsonResponse({'error': 'Incompletion reason must be selected'}, status=400)

    try:
        updated = update_user_exercise_reason(uex_id, reason)
    except Exception as e:
        return JsonResponse({'error': f'Failed to save incompletion reason: {e}'}, status=500)

    return JsonResponse(updated)

# get streak
@require_GET
def exercise_streak_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    result = calc_exc_streak(sub)
    return JsonResponse(result)