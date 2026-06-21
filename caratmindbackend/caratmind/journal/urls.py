from django.urls import path
from . import views

urlpatterns = [
    path('api/journals/new', views.create_journal_view, name='create_journal'),
]