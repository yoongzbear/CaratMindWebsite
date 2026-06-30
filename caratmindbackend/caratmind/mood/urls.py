from django.urls import include, path

from mood import views

urlpatterns = [
    path('api/mood/streak/', views.negative_mood_streak_view, name='get_negative_mood_streak'),
    path('api/mood/chart/', views.mood_chart_view, name='mood_chart'),
    path('api/mood/<str:jrnl_id>/', views.get_mood_view, name='get_mood'),
]