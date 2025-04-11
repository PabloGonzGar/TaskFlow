from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.user_register, name='user_register'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='user_logout'),
    path('refresh-token/', views.refresh_token, name='refresh_token'),
    path('stats/', views.show_user_stats, name='show_user_stats'),
]