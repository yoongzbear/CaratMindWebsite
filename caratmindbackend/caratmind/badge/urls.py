from django.urls import path
from . import views

urlpatterns = [
    path('api/badge/list/', views.get_user_badges_view, name='get_user_badges'),    
]