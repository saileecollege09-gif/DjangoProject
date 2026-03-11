"""
Views for myapp.
Simple homepage with "Hello World" message.
"""
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
import random


def home(request):
    """Simple Hello World view."""
    return HttpResponse("Hello World")


def home_template(request):
    """Hello World view using a template."""
    return render(request, 'home.html')


# ========================
# Authentication API Views
# ========================

@csrf_exempt
@api_view(['POST'])
def signup_view(request):
    """
    Handle user registration.
    Expected POST data: { username, email, password }
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not email or not password:
        return Response({'error': 'All fields are required'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully', 'user_id': user.id}, status=201)


@csrf_exempt
@api_view(['POST'])
def login_view(request):
    """
    Handle user login.
    Expected POST data: { email, password }
    Returns: { access: token_string, user_id: id }
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password are required'}, status=400)
    
    # Find user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)
    
    # Authenticate user
    user = authenticate(username=user.username, password=password)
    
    if user is not None:
        login(request, user)
        # Return a simple token (in production, use JWT)
        return Response({
            'access': f'token_{user.id}_{random.randint(1000, 9999)}',
            'user_id': user.id,
            'username': user.username
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=401)


# ========================
# AI Detection API Views
# ========================

@api_view(['POST'])
def detect_text_view(request):
    """
    Analyze text to detect if it was AI-generated.
    Expected POST data: { text }
    Returns: { score: 0-100, label: "AI Generated" or "Human Written" }
    """
    text = request.data.get('text', '')
    
    if not text:
        return Response({'error': 'Text is required'}, status=400)
    
    # Simulated AI detection logic
    # In production, integrate with an actual AI detection model
    # This is a placeholder that returns random results for demonstration
    
    # Simple heuristic: very short or very uniform text might be AI
    word_count = len(text.split())
    unique_ratio = len(set(text.lower().split())) / max(word_count, 1)
    
    # Generate a simulated score
    ai_score = random.randint(20, 85)
    
    # Adjust based on text characteristics
    if word_count < 10:
        ai_score = random.randint(30, 60)
    elif unique_ratio < 0.5:
        ai_score = min(95, ai_score + 20)
    
    label = "AI Generated" if ai_score > 50 else "Human Written"
    
    return Response({
        'score': ai_score,
        'label': label
    })


@api_view(['POST'])
def detect_image_view(request):
    """
    Analyze image to detect if it was AI-generated.
    Expected POST data: { image } (file upload)
    Returns: { score: 0-100, label: "AI Generated" or "Human" }
    """
    # Check if image file is provided
    if 'image' not in request.FILES:
        return Response({'error': 'Image file is required'}, status=400)
    
    image_file = request.FILES['image']
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Supported: JPG, PNG, WEBP'}, status=400)
    
    # Simulated AI image detection logic
    # In production, integrate with an actual AI image detection model
    # This is a placeholder that returns random results for demonstration
    
    # Generate a simulated score
    ai_score = random.randint(25, 80)
    
    label = "AI Generated" if ai_score > 50 else "Human"
    
    return Response({
        'score': ai_score,
        'label': label
    })

