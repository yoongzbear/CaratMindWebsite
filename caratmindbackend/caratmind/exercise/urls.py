from django.urls import path
from . import views

urlpatterns = [
    path('api/exercise/list/', views.create_journal_view, name='list_exercises'),
    # path('api/journals/list/', views.list_journals_view, name='list_journals'),
    path('api/exercise/<str:exc_id>/', views.get_journal_view, name='get_exercise'),
    # path('api/journals/<str:jrnl_id>/update/', views.update_journal_view, name='update_journal'),
]