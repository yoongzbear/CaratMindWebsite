from django.urls import path
from . import views

urlpatterns = [
    path('api/exercise/list/', views.list_exercises_view, name='list_exercises'),
    path('api/exercise/<str:exc_id>/', views.get_exercise_view, name='get_exercise'),
    path('api/user_exercise/list/', views.list_user_exercises_view, name='list_user_exercises'),
    path('api/user_exercise/<str:uex_id>/', views.get_user_exercise_view, name='get_user_exercise'),
    path('api/user_exercise/<str:uex_id>/rating/', views.rating_user_exercise_view, name='rating_user_exercise'),
]