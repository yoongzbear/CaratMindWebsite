from django.urls import include, path

urlpatterns = [
    path('mood/', include('mood.urls')),
]