from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from accounts.authentication import authenticate_bearer
from exercise.dynamodb_service import get_all_exercises, get_exercise_by_id

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

    return JsonResponse({exercise})