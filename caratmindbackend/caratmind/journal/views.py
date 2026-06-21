import json
import uuid
from datetime import datetime, timezone

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from accounts.authentication import authenticate_bearer
from .dynamodb_service import create_journal_entry
from .s3_service import upload_entry_text

VALID_STATUSES = {'draft', 'submitted'}

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

    item = {
        'jrnl_id': jrnl_id,
        'jrnl_entry_key': entry_key,
        'jrnl_created_at': now,
        'jrnl_updated_at': now,
        'jrnl_submitted_at': now if status == 'submitted' else None,
        'jrnl_status': status,
        'user_id': sub,
    }

    # upload into database
    try:
        create_journal_entry(item)
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