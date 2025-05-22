import tasks.views
from django.urls import path

urlpatterns = [
    path('create/', tasks.views.create_task, name='create_task'),
    path('recommendations/', tasks.views.get_recommendations, name='get_recommendations'),
    path('tags/', tasks.views.get_tags, name='get_tags'),
    path('admin/tags/delete/<id>/', tasks.views.delete_tag, name='delete_tag'),
    path('tasks/', tasks.views.get_tasks, name='get_tasks'),
    path('update/', tasks.views.update_task, name='update_task'),
    path('admin/tags/update/', tasks.views.update_tag, name="update_tag"),
    path('delete/<id>/', tasks.views.delete_task, name='delete_task'),
    path('completed/<id>/', tasks.views.set_task_completed, name='set_task_completed'),
]