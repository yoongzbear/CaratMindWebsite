from django.urls import path
from . import views

urlpatterns = [
    path('api/habit/list/', views.list_habit_view, name='list_habit'),
    path('api/habit/today/', views.today_habit_view, name='today_habit'),
    path('api/habit/save/', views.save_habit_action_view, name='save_habit_action'),
]