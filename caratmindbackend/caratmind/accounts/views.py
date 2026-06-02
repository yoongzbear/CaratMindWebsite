from django.shortcuts import render

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .services import CognitoService
import json

def login_view(request):
    """Redirect to Cognito login page."""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    cognito_service = CognitoService()
    authorization_url = cognito_service.get_authorization_url()
    return redirect(authorization_url)
def callback_view(request):
    """Handle Cognito callback after authentication."""
    code = request.GET.get('code')
    error = request.GET.get('error')

    # Handle custom attributes
    custom_attributes = {}
    for key, value in user_info.items():
        if key.startswith('custom:'):
            custom_attributes[key.replace('custom:', '')] = value
    
    # Store custom attributes in user profile or session
    request.session['custom_attributes'] = custom_attributes
    
    if error:
        messages.error(request, f'Authentication failed: {error}')
        return redirect('home')
    
    if not code:
        messages.error(request, 'Authorization code not provided')
        return redirect('home')
    
    cognito_service = CognitoService()
    
    # Exchange code for tokens
    tokens = cognito_service.exchange_code_for_tokens(code)
    if not tokens:
        messages.error(request, 'Failed to obtain tokens')
        return redirect('home')
    
    # Verify and decode the ID token
    id_token = tokens.get('id_token')
    user_info = cognito_service.verify_token(id_token)
    
    if not user_info:
        messages.error(request, 'Invalid token')
        return redirect('home')
    
    # Store tokens in session
    request.session['access_token'] = tokens.get('access_token')
    request.session['refresh_token'] = tokens.get('refresh_token')
    request.session['id_token'] = id_token
    
    # Create or get Django user
    email = user_info.get('email')
    username = user_info.get('cognito:username', email)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', '')
        )
    
    # Log the user in
    login(request, user)
    messages.success(request, 'Successfully logged in!')
    
    return redirect('dashboard')
def logout_view(request):
    """Handle user logout."""
    access_token = request.session.get('access_token')
    
    if access_token:
        cognito_service = CognitoService()
        cognito_service.sign_out_user(access_token)
    
    # Clear session
    request.session.flush()
    
    # Redirect to Cognito logout URL
    logout_url = f"{settings.COGNITO_DOMAIN}/logout?client_id={settings.AWS_COGNITO_APP_CLIENT_ID}&logout_uri={settings.COGNITO_LOGOUT_URI}"
    return redirect(logout_url)
def dashboard_view(request):
    """Protected dashboard view."""
    if not request.user.is_authenticated:
        return redirect('login')
    
    return render(request, 'authentication/dashboard.html', {
        'user': request.user
    })
def home_view(request):
    """Home page view."""
    return render(request, 'authentication/home.html')