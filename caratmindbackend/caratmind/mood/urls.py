from django.urls import include, path

from mood import views

urlpatterns = [
    path('api/mood/streak/', views.negative_mood_streak_view, name='get_negative_mood_streak'),
    path('api/mood/chart/', views.mood_chart_view, name='mood_chart'),
    path('api/mood/scatter/', views.mood_scatter_view, name='mood_scatter'),
    path('api/mood/<str:jrnl_id>/', views.get_mood_view, name='get_mood'),
    path('api/mood/<str:jrnl_id>/confirm/', views.confirm_mood_view, name='confirm_mood'),
    path('api/mood/<str:jrnl_id>/corrected/', views.corrected_mood_view, name='corrected_mood'),
]