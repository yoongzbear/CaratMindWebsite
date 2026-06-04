import json

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_GET

from .authentication import authenticate_bearer
from .services import CognitoService


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

    return JsonResponse(
        {
            'allowed': True,
            'user': {
                'username': principal.username,
                'email': principal.email,
                'sub': principal.claims.get('sub'),
            },
        }
    )


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
