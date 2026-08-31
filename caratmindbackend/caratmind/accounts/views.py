import json
import logging
import re

import boto3
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from accounts.services import CognitoService
from exercise.dynamodb_service import delete_all_user_exercise
from habit.dynamodb_services import delete_all_user_habit
from journal.dynamodb_service import delete_all_user_entries
from journal.s3_service import delete_entry_text
from mood.dynamodb_service import delete_all_user_mood
from .authentication import authenticate_bearer
from .services import CognitoService
from .dynamodb_service import create_user_if_not_exists, delete_user_record, get_user, update_email_preference, update_onboarding, update_preferred_name, update_theme

def _validate_password(password: str) -> str | None:
    if len(password) < 8:
        return f'Password must be at least {8} characters.'
    if not re.search(r'[a-z]', password) or not re.search(r'[A-Z]', password) or not re.search(r'\d', password):
        return 'Password must include uppercase, lowercase, and a number.'
    return None

@csrf_exempt
@require_POST
def register_view(request):
    cognito = CognitoService()
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    username = None
    try:
        # confirmation step
        if body.get('confirmationCode') and body.get('username'):
            username = body['username'].strip()
            sub = (body.get('sub') or '').strip()
            email = (body.get('email') or '').strip()
            preferred_username = (body.get('preferredUsername') or '').strip()

            if not sub or not email or not preferred_username:
                return JsonResponse({'error': 'Missing user details for confirmation.'}, status=400)

            cognito.confirm_sign_up(username, body['confirmationCode'])
            create_user_if_not_exists(
                user_id=sub,
                email=email,
                username=username,
                preferred_name=preferred_username,
            )
            return JsonResponse({'confirmed': True})

        # initial signup step
        username = (body.get('username') or '').strip()
        email = (body.get('email') or '').strip()
        preferred_username = (body.get('preferredUsername') or '').strip()
        password = body.get('password') or ''
        confirm_password = body.get('confirmPassword') or ''

        if not username or not email or not preferred_username or not password:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match.'}, status=400)

        password_error = _validate_password(password)
        if password_error:
            return JsonResponse({'error': password_error}, status=400)

        if cognito.find_confirmed_email(email):
            return JsonResponse(
                {'error': 'An account with this email already exists. Please log in instead.'},
                status=400,
            )

        result = cognito.sign_up_user(username, password, email, preferred_username)

        if result['user_confirmed']:
            create_user_if_not_exists(
                user_id=result['user_sub'],
                email=email,
                username=username,
                preferred_name=preferred_username,
            )

        return JsonResponse({
            'userConfirmed': result['user_confirmed'],
            'username': username,
            'sub': result['user_sub'],
            'message': (
                'Account created. You can sign in now.'
                if result['user_confirmed']
                else 'Account created. Check your email for a verification code.'
            ),
        })

    except Exception as e:
        error_name = e.__class__.__name__
        if error_name == 'UsernameExistsException' and username:
            status = cognito.get_user_status(username)
            if status['exists'] and not status['confirmed'] and status['sub']:
                cognito.resend_confirmation_code(username)
                return JsonResponse({
                    'userConfirmed': False,
                    'username': username,
                    'sub': status['sub'],
                    'message': 'This account is not yet verified. A new verification code has been sent to your email.',
                })
            return JsonResponse(
                {'error': 'An account with this username already exists. Please log in instead.'},
                status=400,
            )

        return JsonResponse({'error': cognito.map_cognito_error(e)}, status=400)

@csrf_exempt
@require_POST
def login_view(request):
    cognito = CognitoService()
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    identifier = (body.get('identifier') or '').strip()
    password = body.get('password') or ''

    if not identifier or not password:
        return JsonResponse({'error': 'Username/email and password are required.'}, status=400)

    try:
        tokens = cognito.sign_in_with_password(identifier, password)
        profile = cognito.get_user_profile(tokens['access_token'])
        sub = profile.get('sub')
        dynamo_user = get_user(sub) if sub else None
        return JsonResponse({
            'tokens': tokens,
            'profile': {
                **profile,
                'onboarding': dynamo_user.get('user_onboarding') if dynamo_user else None,
            },
        })
    except Exception as e:
        error_name = e.__class__.__name__

        # enable verification in login if not confirmed yet 
        if error_name == 'UserNotConfirmedException':
            try:
                status = cognito.get_user_status(identifier)
                if status['exists'] and status['sub']:
                    cognito.resend_confirmation_code(identifier)
                    return JsonResponse({
                        'error': cognito.map_cognito_error(e),
                        'needsConfirmation': True,
                        'username': identifier,
                        'sub': status['sub'],
                        'email': status['email'],
                        'preferredUsername': status['preferredUsername'],
                        'message': 'This account is not verified yet. A new verification code has been sent to your email.',
                    }, status=403)
            except Exception:
                pass
        logger.error(f'Login error: {e.__class__.__name__}: {e}', exc_info=True)
        return JsonResponse({'error': cognito.map_cognito_error(e)}, status=401)

@csrf_exempt
@require_POST
def refresh_token_view(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    username = (body.get('username') or '').strip()
    refresh_token = body.get('refreshToken')

    if not username or not refresh_token:
        return JsonResponse({'error': 'username and refreshToken are required'}, status=400)

    cognito = CognitoService()
    try:
        tokens = cognito.refresh_tokens(username, refresh_token)
        profile = cognito.get_user_profile(tokens['access_token'])
        sub = profile.get('sub')
        dynamo_user = get_user(sub) if sub else None
        return JsonResponse({
            'tokens': tokens,
            'profile': {
                **profile,
                'onboarding': dynamo_user.get('user_onboarding') if dynamo_user else None,
            },
        })
    except Exception as e:
        return JsonResponse({'error': cognito.map_cognito_error(e)}, status=401)

@csrf_exempt
@require_POST
def logout_view(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        body = {}

    access_token = body.get('accessToken')

    if access_token:
        cognito = CognitoService()
        cognito.sign_out_user(access_token)

    return JsonResponse({'logout': True})

@require_GET
def api_me_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'allowed': False, 'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    dynamo_user = get_user(sub) if sub else None

    if not dynamo_user:        
        return JsonResponse(
            {
                'allowed': True,
                'user': {
                    'username': principal.username,
                    'email': principal.email,
                    'sub': sub,
                    'preferredUsername': None,
                    'onboarding': None,
                },
            }
        )

    return JsonResponse(
        {
            'allowed': True,
            'user': {
                'username': dynamo_user.get('username') or principal.username,
                'email': dynamo_user.get('user_email') or principal.email,
                'sub': sub,
                'preferredUsername': dynamo_user.get('preferred_name'),
                'onboarding': dynamo_user.get('user_onboarding'),
            },
        }
    )

# onboarding done update
@csrf_exempt
@require_http_methods(['PATCH'])
def complete_onboarding_view(request, page: str):
    logger.info("page:", page)
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'allowed': False, 'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    update_onboarding(sub, page, True)  
    return JsonResponse({'allowed': True})

@require_GET
def api_protected_example_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Forbidden'}, status=403)

    return JsonResponse(
        {
            'message': 'Access granted',
            'username': principal.username,
        }
    )

@csrf_exempt
@require_POST
def provision_user_view(request):
    internal_key = request.META.get('HTTP_X_INTERNAL_API_KEY', '')
    if not internal_key or internal_key != settings.INTERNAL_API_KEY:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    sub = (body.get('sub') or '').strip()
    email = (body.get('email') or '').strip()
    username = (body.get('username') or '').strip()
    preferred_name = (body.get('preferredUsername') or '').strip()

    if not sub or not username or not email:
        return JsonResponse({'error': 'sub, username and email are required'}, status=400)

    created = create_user_if_not_exists(
        user_id=sub,
        email=email,
        username=username,
        preferred_name=preferred_name,
    )
    return JsonResponse({'created': created}, status=201 if created else 200)

@csrf_exempt
@require_http_methods(['PATCH'])
def update_preferred_name_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    preferred_name = (body.get('preferredUsername') or '').strip()
    if not preferred_name:
        return JsonResponse({'error': 'preferredUsername is required'}, status=400)

    sub = principal.claims.get('sub')
    if not sub:
        return JsonResponse({'error': 'Missing sub claim'}, status=400)

    try:
        update_preferred_name(user_id=sub, preferred_name=preferred_name)
        CognitoService().admin_update_preferred_username(
            username=principal.username,
            preferred_username=preferred_name,
        )
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'preferredUsername': preferred_name})

logger = logging.getLogger(__name__)

# delete account
@csrf_exempt
@require_http_methods(['DELETE'])
def delete_account_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    username = principal.claims.get('username') or principal.claims.get('cognito:username')

    errors = []

    # delete journal entries
    try:
        entries = delete_all_user_entries(sub) # DynamoDB
        # delete_entry_text(entries) # S3
        delete_entry_text(sub)
    except Exception as e:
        errors.append(f'Delete journal error: {e}')

    # delete mood records
    try:
        delete_all_user_mood(sub)
    except Exception as e:
        errors.append(f'Delete mood error: {e}')

    # delete user_exercise records
    try:
        delete_all_user_exercise(sub)
    except Exception as e:
        errors.append(f'Delete user exercise error: {e}')

    # delete user habit records
    try:
        delete_all_user_habit(sub)
    except Exception as e:
        errors.append(f'Delete user habit error: {e}')

    # delete user profile record in DynamoDB
    try:
        delete_user_record(sub)
    except Exception as e:
        errors.append(f'Delete user DB error: {e}')

    if errors:
        logger.error("DELETE ACCOUNT ERRORS:", errors) 
        # data deletion partially failed, dont delete the cognito identity
        return JsonResponse(
            {'error': 'Failed to delete some account data.', 'details': errors},
            status=500,
        )

    # delete cognito identity 
    try:
        cognito_client = boto3.client('cognito-idp', region_name=settings.AWS_COGNITO_REGION)
        cognito_client.admin_delete_user(
            UserPoolId=settings.AWS_COGNITO_USER_POOL_ID,
            Username=username,
        )
    except Exception as e:
        return JsonResponse(
            {'error': f'Data was deleted but failed to remove account credentials: {e}'},
            status=500,
        )    

    return JsonResponse({'success': True})

# update theme
@csrf_exempt
@require_http_methods(['PUT'])
def update_theme_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    theme = (body.get('theme') or '').strip()
    if not theme:
        return JsonResponse({'error': 'theme is required'}, status=400)

    sub = principal.claims.get('sub')
    if not sub:
        return JsonResponse({'error': 'Missing sub claim'}, status=400)

    try:
        update_theme(user_id=sub, theme=theme)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'theme': theme})

@require_GET
def get_theme_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')

    user = get_user(sub)
    if not user:
        return JsonResponse({'error': 'User not found.'}, status=404)

    return JsonResponse({
        'theme': user.get('user_theme', 'light')
    })

@require_GET
def get_email_notification_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    user = get_user(sub)
    if not user:
        return JsonResponse({'error': 'User not found.'}, status=404)
    
    return JsonResponse(user.get('notification_pref', {}))

@csrf_exempt
@require_http_methods(['PATCH'])
def update_email_notification_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    if not sub:
        return JsonResponse({'error': 'Missing sub claim'}, status=400)
    
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON body'}, status=400)
    prefs = body.get('notification_pref')
    try: 
        updated = update_email_preference(sub, prefs)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse(updated.get('notification_pref', prefs))

# forgot password
@csrf_exempt
@require_POST
def forgot_password_view(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    identifier = (body.get('identifier') or '').strip()
    if not identifier:
        return JsonResponse({'error': 'Username or email is required.'}, status=400)

    cognito = CognitoService()
    try:
        cognito.forgot_password(identifier)
    except Exception as e:
        error_name = e.__class__.__name__
        if error_name != 'UserNotFoundException':
            logger.error(f'Forgot password error: {error_name}: {e}', exc_info=True)
    return JsonResponse({
        'message': 'A password reset code has been sent.',
    })


@csrf_exempt
@require_POST
def reset_password_view(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    username = (body.get('username') or '').strip()
    confirmation_code = (body.get('confirmationCode') or '').strip()
    new_password = body.get('newPassword') or ''
    confirm_password = body.get('confirmPassword') or ''

    if not username or not confirmation_code or not new_password:
        return JsonResponse({'error': 'username, confirmationCode and newPassword are required.'}, status=400)

    if new_password != confirm_password:
        return JsonResponse({'error': 'Passwords do not match.'}, status=400)

    password_error = _validate_password(new_password)
    if password_error:
        return JsonResponse({'error': password_error}, status=400)

    cognito = CognitoService()
    try:
        cognito.confirm_forgot_password(username, confirmation_code, new_password)
    except Exception as e:
        logger.error(f'Reset password error: {e.__class__.__name__}: {e}', exc_info=True)
        return JsonResponse({'error': cognito.map_cognito_error(e)}, status=400)

    return JsonResponse({'success': True})