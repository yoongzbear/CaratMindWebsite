import calendar
import json
import uuid
import logging
from datetime import date, datetime, timezone

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from accounts.authentication import authenticate_bearer
from accounts.dynamodb_service import get_user
from exercise.dynamodb_service import delete_user_exercise_by_id
from mood.dynamodb_service import calc_negative_mood_streak, delete_mood_by_id
from mood.services import detect_store_mood
from notification.dynamodb_service import STREAK_THRESHOLD_DAYS, already_notified, mark_notified
from notification.ses_service import send_notification
from .dynamodb_service import calc_journal_streak, create_journal_entry, get_all_entry_user, get_user_journal_dates, local_month_bounds_utc, update_journal_entry, update_journal_mood_exc
from .s3_service import upload_entry_text
from django.views.decorators.http import require_GET
from .dynamodb_service import get_entries_for_user_on_date, get_entry_by_id
from .s3_service import get_entry_text

VALID_STATUSES = {'draft', 'submitted'}
PREVIEW_LENGTH = 150 # 150 characters

logger = logging.getLogger(__name__)

# new journal
@csrf_exempt
@require_POST
def create_journal_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    if not sub:
        return JsonResponse({'error': 'Missing sub claim'}, status=400)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    entry_text = body.get('entry') or ''
    status = body.get('status')

    if not entry_text.strip():
        return JsonResponse({'error': 'Entry text is required'}, status=400)
    if status not in VALID_STATUSES:
        return JsonResponse({'error': 'Status must be "draft" or "submitted"'}, status=400)

    jrnl_id = str(uuid.uuid4())
    entry_key = f'journals/{sub}/{jrnl_id}.txt'
    now = datetime.now(timezone.utc).isoformat()

    # upload to S3
    try:
        upload_entry_text(entry_key, entry_text)
    except Exception as e:
        return JsonResponse({'error': f'Failed to store entry: {e}'}, status=500)
        
    preview_text = entry_text.strip()[:PREVIEW_LENGTH]

    item = {
        'jrnl_id': jrnl_id,
        'jrnl_entry_key': entry_key,
        'jrnl_created_at': now,
        'jrnl_updated_at': now,
        'jrnl_submitted_at': now if status == 'submitted' else None,
        'jrnl_status': status,
        'jrnl_preview': preview_text,
        'mood_id': None,
        'mood_name': None,
        'uex_id': None,
        'user_id': sub,
    }

    # upload into database
    try:
        create_journal_entry(item)
        # detect mood if entry submitted
        if status == 'submitted':            
            detect_store_mood(jrnl_id, sub, entry_text)  
            # TODO: check helpline trigger
            try:
                streak = calc_negative_mood_streak(sub)
                if streak >= STREAK_THRESHOLD_DAYS and not already_notified(sub, 'mood_helpline'):
                    user = get_user(sub) 
                    send_notification(user['email'], 'mood-helpline', {
                        'name': user.get('name', ''),
                        'streak_days': streak,
                    })
                    mark_notified(sub, 'mood_helpline')
            except Exception:
                logger.exception('mood helpline email failed')           
            
    except Exception as e:
        return JsonResponse({'error': f'Failed to save entry metadata: {e}'}, status=500)

    return JsonResponse(
        {
            'jrnl_id': jrnl_id,
            'status': status,
            'createdAt': now,
        },
        status=201,
    )

# by date
@require_GET
def list_journals_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    date_str = request.GET.get('date')  # 'YYYY-MM-DD'
    if not date_str:
        return JsonResponse({'error': 'date query param is required'}, status=400)

    try:
        entries = get_entries_for_user_on_date(sub, date_str)
    except Exception as e:
        return JsonResponse({'error': f'Failed to load entries: {e}'}, status=500)

    # Most recent first
    entries.sort(key=lambda e: e.get('jrnl_created_at', ''), reverse=True)

    return JsonResponse({'entries': entries})

# by ID
@require_GET
def get_journal_view(request, jrnl_id):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    entry = get_entry_by_id(jrnl_id)

    if not entry or entry.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)

    try:
        full_text = get_entry_text(entry['jrnl_entry_key'])
    except Exception as e:
        return JsonResponse({'error': f'Failed to load entry text: {e}'}, status=500)

    return JsonResponse({**entry, 'entryText': full_text})

# update entry
@csrf_exempt
@require_POST
def update_journal_view(request, jrnl_id):
    principal = authenticate_bearer(request)

    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    entry = get_entry_by_id(jrnl_id)

    if not entry or entry.get('user_id') != sub:
        return JsonResponse({'error': 'Not found'}, status=404)
    
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    entry_text = body.get('entry', '')
    jrnl_status = body.get('status', entry['jrnl_status'])

    if not entry_text.strip():
        return JsonResponse({'error': 'Entry text is required'}, status=400)

    jrnl_preview = entry_text.strip()[:PREVIEW_LENGTH]

    try:
        upload_entry_text(
            entry['jrnl_entry_key'],
            entry_text,
        )

        update_journal_entry(
            jrnl_id,
            jrnl_preview,
            jrnl_status,
        )

        # detect mood if entry submitted
        if jrnl_status == 'submitted':
            detect_store_mood(jrnl_id, sub, entry_text)
        # delete mood and user exercise when save as draft 
        elif jrnl_status == 'draft':
            update_journal_mood_exc(jrnl_id, None, None, None, None)
            delete_mood_by_id(jrnl_id)
            delete_user_exercise_by_id(jrnl_id)

    except Exception as e:
        return JsonResponse(
            {'error': str(e)},
            status=500,
        )

    return JsonResponse({
        'success': True,
        'jrnl_id': jrnl_id,
    })

# get streak
@require_GET
def journal_streak_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    result = calc_journal_streak(sub)
    return JsonResponse(result)

# download entries
@require_GET
def download_journal_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    try:
        entries = get_all_entry_user(sub) 
    except Exception as e:
        return JsonResponse({'error': f'Failed to load entries: {e}'}, status=500)
    
    result = []

    for entry in entries:
        entry_key = entry.get('jrnl_entry_key')
        full_text = ''
        if entry_key:
            try:
                full_text = get_entry_text(entry_key) # S3 
            except Exception as e:
                full_text = '[Unable to retrieve entry text]'

        result.append({
            'jrnl_created_at': entry.get('jrnl_created_at'),
            'entryText': full_text,
            'mood_name': entry.get('mood_name'),
            'exc_name': entry.get('exc_name'),
        })

    return JsonResponse({'entries': result})

# get dates with journal entry
@require_GET
def journal_calendar_dates_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    month_str = request.GET.get('month')  # 'YYYY-MM'
    if not month_str:
        return JsonResponse({'error': 'month query param is required (YYYY-MM)'}, status=400)

    try:
        year, month = map(int, month_str.split('-'))
    except ValueError:
        return JsonResponse({'error': 'Invalid month format, expected YYYY-MM'}, status=400)

    start_date, end_date = local_month_bounds_utc(year, month)

    try:
        journal_dates = get_user_journal_dates(sub, start_date, end_date)
        # exercise_dates = get_completed_dates_for_user(sub, start_date, end_date + 'T23:59:59')
    except Exception as e:
        return JsonResponse({'error': f'Failed to load calendar dates: {e}'}, status=500)

    return JsonResponse({
        'journalDates': sorted(journal_dates),
        # 'exerciseDates': sorted(exercise_dates),
    })