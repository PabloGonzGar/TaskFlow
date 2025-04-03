import tasks.views
from django.urls import path

urlpatterns = [
    path('tasks/', tasks.views.create_task, name='create_task'),
    path('recommendations/', tasks.views.get_recommendations, name='get_recommendations'),
]