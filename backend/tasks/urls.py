import tasks.views
from django.urls import path

urlpatterns = [
    path('create/', tasks.views.create_task, name='create_task'),
    path('recommendations/', tasks.views.get_recommendations, name='get_recommendations'),
    path('tags/', tasks.views.get_tags, name='get_tags'),
]