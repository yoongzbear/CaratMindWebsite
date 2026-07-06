from django.urls import path
from . import views

urlpatterns = [
    path('api/journal/download/', views.download_journal_view, name='download_journal'),
    path('api/journal/new', views.create_journal_view, name='create_journal'),
    path('api/journal/list/', views.list_journals_view, name='list_journals'),
    path('api/journal/streak/', views.journal_streak_view, name='journal_streak'),
    path('api/journal/<str:jrnl_id>/', views.get_journal_view, name='get_journal'),
    path('api/journal/<str:jrnl_id>/update/', views.update_journal_view, name='update_journal'),
]