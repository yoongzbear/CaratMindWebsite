import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_GET, require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .authentication import authenticate_bearer
from .services import CognitoService
from .dynamodb_service import create_user_if_not_exists, get_user, update_preferred_name


def login_view(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    cognito_service = CognitoService()
    return redirect(cognito_service.get_authorization_url())


def callback_view(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error:
        messages.error(request, f'Authentication failed: {error}')
        return redirect('home')

    if not code:
        messages.error(request, 'Authorization code not provided')
        return redirect('home')

    cognito_service = CognitoService()
    tokens = cognito_service.exchange_code_for_tokens(code)
    if not tokens:
        messages.error(request, 'Failed to obtain tokens')
        return redirect('home')

    id_token = tokens.get('id_token')
    user_info = cognito_service.verify_id_token(id_token)
    if not user_info:
        messages.error(request, 'Invalid token')
        return redirect('home')

    custom_attributes = {
        key.replace('custom:', ''): value
        for key, value in user_info.items()
        if key.startswith('custom:')
    }
    request.session['custom_attributes'] = custom_attributes
    request.session['access_token'] = tokens.get('access_token')
    request.session['refresh_token'] = tokens.get('refresh_token')
    request.session['id_token'] = id_token

    email = user_info.get('email')
    username = user_info.get('cognito:username', email)
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', ''),
        )

    login(request, user)
    messages.success(request, 'Successfully logged in!')
    return redirect('dashboard')


def logout_view(request):
    access_token = request.session.get('access_token')
    if access_token:
        CognitoService().sign_out_user(access_token)

    request.session.flush()
    logout_url = (
        f"{settings.COGNITO_DOMAIN}/logout?"
        f"client_id={settings.AWS_COGNITO_APP_CLIENT_ID}&"
        f"logout_uri={settings.COGNITO_LOGOUT_URI}"
    )
    return redirect(logout_url)


def dashboard_view(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, 'accounts/dashboard.html', {'user': request.user})


def home_view(request):
    return render(request, 'accounts/home.html')

@require_GET
def api_me_view(request):
    principal = authenticate_bearer(request)
    if not principal:
        return JsonResponse({'allowed': False, 'error': 'Unauthorized'}, status=401)

    sub = principal.claims.get('sub')
    dynamo_user = get_user(sub) if sub else None

    if not dynamo_user:
        # Provisioning never ran for this user — fall back to Cognito claims
        # rather than returning blank fields.
        return JsonResponse(
            {
                'allowed': True,
                'user': {
                    'username': principal.username,
                    'email': principal.email,
                    'sub': sub,
                    'preferredUsername': None,
                    'completedOnboarding': None,
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
                'completedOnboarding': dynamo_user.get('user_complete_onboarding'),
            },
        }
    )

# @require_GET
# def api_me_view(request):
#     principal = authenticate_bearer(request)
#     if not principal:
#         return JsonResponse({'allowed': False, 'error': 'Unauthorized'}, status=401)

#     sub = principal.claims.get('sub')
#     dynamo_user = get_user(sub) if sub else None

#     return JsonResponse(
#         {
#             'allowed': True,
#             'user': {
#                 'username': principal.username,
#                 'email': principal.email,
#                 'sub': sub,
#                 'preferredUsername': dynamo_user.get('preferred_name') if dynamo_user else None,
#                 'completedOnboarding': dynamo_user.get('user_complete_onboarding') if dynamo_user else None,
#             },
#         }
#     )

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
    # Server-to-server call from Next.js, not a user-authenticated request —
    # no Cognito access token yet 
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