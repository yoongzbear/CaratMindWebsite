from django.urls import path
from . import views

urlpatterns = [
    # path('', views.home_view, name='home'),
    # path('dashboard/', views.dashboard_view, name='dashboard'),
    path('api/me/', views.api_me_view, name='api_me'),
    path('api/protected/', views.api_protected_example_view, name='api_protected'),
    path('api/accounts/delete/', views.delete_account_view, name='delete_account'),
    path('api/accounts/get-email/', views.get_email_notification_view, name='get_email_notification'),
    path('api/accounts/update-email/', views.update_email_notification_view, name='update_email_notification'),
    path('api/accounts/login/', views.login_view, name='login_account'),
    path('api/accounts/logout/', views.logout_view, name='logout_account'),
    path('api/accounts/onboarding/complete/', views.complete_onboarding_view, name='complete_onboarding'),
    path('api/accounts/provision/', views.provision_user_view, name='provision_user'),
    path('api/accounts/refresh/', views.refresh_token_view, name='refresh_token'),
    path('api/accounts/register/', views.register_view, name='register'),
    path('api/accounts/theme/', views.get_theme_view, name='get_theme'),
    path('api/accounts/theme/update/', views.update_theme_view, name='update_theme'),    
    path('api/accounts/update-name/', views.update_preferred_name_view, name='update_preferred_name'),
]
