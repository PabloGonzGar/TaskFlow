import tasks.views
from django.urls import path

urlpatterns = [
    path('create/', tasks.views.create_task, name='create_task'),
    path('recommendations/', tasks.views.get_recommendations, name='get_recommendations'),
    path('tags/', tasks.views.get_tags, name='get_tags'),
    path('tasks/', tasks.views.get_tasks, name='get_tasks'),
    path('update/', tasks.views.update_task, name='update_task'),
    path('delete/<id>/', tasks.views.delete_task, name='delete_task'),
]