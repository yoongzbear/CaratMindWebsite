from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('auth/callback/', views.callback_view, name='callback'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('api/me/', views.api_me_view, name='api_me'),
    path('api/protected/', views.api_protected_example_view, name='api_protected'),
]
