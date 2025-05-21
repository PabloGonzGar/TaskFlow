from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.user_register, name='user_register'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='user_logout'),
    path('refresh-token/', views.refresh_token, name='refresh_token'),
    path('stats/', views.show_user_stats, name='show_user_stats'),
    path('admin/stats/', views.get_all_task_stats, name='get_all_task_stats'),
    path('admin/users/', views.get_all_users, name='get_all_users'),
    path('admin/users/<id>/', views.delete_user, name='delete_user'),
]