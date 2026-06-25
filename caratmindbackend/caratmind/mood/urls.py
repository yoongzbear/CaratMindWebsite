from django.urls import include, path

from mood import views

urlpatterns = [
    # path('api/mood', include('mood.urls')),
    path('api/mood/<str:jrnl_id>/', views.get_mood_view, name='get_mood'),
]