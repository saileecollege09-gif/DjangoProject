"""
URL patterns for myapp.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    
    # Authentication endpoints
    path('api/signup/', views.signup_view, name='signup'),
    path('api/login/', views.login_view, name='login'),
    
    # AI Detection endpoints
    path('api/detect-text/', views.detect_text_view, name='detect_text'),
    path('api/detect-image/', views.detect_image_view, name='detect_image'),
    path('api/chat/', views.chat_huggingface, name='chat_hf'),
]

