import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from accounts.authentication import authenticate_bearer
from habit.dynamodb_services import get_all_habit, save_user_habit, select_today_habit

# get all habits
@require_GET
def list_habit_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    try:        
        habits = get_all_habit()
    except Exception as e:
        return JsonResponse({'error': f'Failed to load habits: {e}'}, status=500)

    return JsonResponse({'habits': habits})

# get randomly selected habit
@require_GET
def today_habit_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    try:
        habit = select_today_habit(sub)
    except Exception as e:
        return JsonResponse({'error': f'Failed to load today\'s habit: {e}'}, status=500)

    if habit is None:
        return JsonResponse({'habit': None, 'message': 'All habits completed for today!'})

    return JsonResponse({'habit': habit})

# save habit
@csrf_exempt
@require_POST
def save_habit_action_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)

    hab_id = body.get('hab_id')
    action = body.get('action')
    status = body.get('status')

    if not hab_id or not action or not status:
        return JsonResponse({'error': 'hab_id, action, and status are required'}, status=400)

    if status not in ('completed', 'incomplete', 'ongoing'):
        return JsonResponse({'error': 'Invalid habit status'}, status=400)

    try:
        saved = save_user_habit(sub, hab_id, action, status)
    except Exception as e:
        return JsonResponse({'error': f'Failed to save habit action: {e}'}, status=500)

    return JsonResponse(saved)