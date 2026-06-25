from django.urls import path
from . import views

urlpatterns = [
    path('api/journals/new', views.create_journal_view, name='create_journal'),
    # path('api/journals/list/', views.list_journals_view, name='list_journals'),
    # path('api/journals/<str:jrnl_id>/', views.get_journal_view, name='get_journal'),
    # path('api/journals/<str:jrnl_id>/update/', views.update_journal_view, name='update_journal'),
]