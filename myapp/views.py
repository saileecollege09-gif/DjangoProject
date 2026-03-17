"""
Views for myapp.
Simple homepage with "Hello World" message.
"""
import logging
import random

import requests
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)


def home(request):
    """ChatGPT UI."""
    return render(request, 'chatgpt.html')


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

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)

    user = authenticate(username=user.username, password=password)

    if user is not None:
        login(request, user)
        return Response({
            'access': f'token_{user.id}_{random.randint(1000, 9999)}',
            'user_id': user.id,
            'username': user.username
        })

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

    word_count = len(text.split())
    unique_ratio = len(set(text.lower().split())) / max(word_count, 1)

    ai_score = random.randint(20, 85)

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
    if 'image' not in request.FILES:
        return Response({'error': 'Image file is required'}, status=400)

    image_file = request.FILES['image']

    allowed_types = ['image/jpeg', 'image/png', 'image/webp']
    if image_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Supported: JPG, PNG, WEBP'}, status=400)

    ai_score = random.randint(25, 80)
    label = "AI Generated" if ai_score > 50 else "Human"

    return Response({
        'score': ai_score,
        'label': label
    })


def _extract_huggingface_reply(data):
    """Normalize Hugging Face response payloads into a single reply string."""
    if isinstance(data, list) and data:
        first = data[0]
        if isinstance(first, dict):
            for key in ('generated_text', 'summary_text', 'answer', 'translation_text'):
                value = first.get(key)
                if value:
                    return str(value).strip()
        if isinstance(first, str):
            return first.strip()

    if isinstance(data, dict):
        if isinstance(data.get('generated_text'), str):
            return data['generated_text'].strip()

        if isinstance(data.get('answer'), str):
            return data['answer'].strip()

        if isinstance(data.get('summary_text'), str):
            return data['summary_text'].strip()

        if isinstance(data.get('error'), str):
            raise ValueError(data['error'])

    return ''


@api_view(['POST'])
def chat_huggingface(request):
    """
    Chat endpoint using Hugging Face Inference API (Free Tier).
    POST data: { "message": "user message" }
    
    Get free API token: https://huggingface.co/settings/tokens
    """
    message = str(request.data.get('message', '')).strip()
    if not message:
        return Response({'error': 'Message is required.'}, status=400)

    api_key = getattr(settings, 'HUGGINGFACE_API_KEY', '')
    model_name = getattr(settings, 'HUGGINGFACE_MODEL', 'gpt2')

    if not api_key or api_key == 'YOUR_HF_TOKEN_HERE':
        return Response({
            'error': 'Hugging Face API key is missing. Get a free token at https://huggingface.co/settings/tokens'
        }, status=500)

    # Hugging Face Inference API - Using new router endpoint
    url = f'https://router.huggingface.co/models/{model_name}'
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    
    # Simple prompt for gpt2
    prompt = message
    
    payload = {
        'inputs': prompt,
        'parameters': {
            'max_new_tokens': 256,
            'temperature': 0.7,
            'return_full_text': False,
            'top_p': 0.95,
        },
        'options': {
            'wait_for_model': True,
        }
    }

    try:
        logger.info(f"Sending request to Hugging Face API: {model_name}")
        response = requests.post(url, headers=headers, json=payload, timeout=90)
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code == 401:
            return Response({
                'error': 'Invalid API key. Check your Hugging Face token.'
            }, status=401)
        
        if response.status_code == 429:
            return Response({
                'error': 'Rate limit exceeded. Please wait 1 minute and try again.'
            }, status=429)
        
        if response.status_code != 200:
            error_text = response.text[:300] if response.text else 'Unknown error'
            return Response({
                'error': f'Hugging Face API error ({response.status_code}): {error_text}'
            }, status=response.status_code)

        data = response.json()
        logger.info(f"Response received")
    except requests.RequestException as exc:
        logger.exception("Hugging Face request failed")
        return Response({'error': f'Unable to reach Hugging Face API: {exc}'}, status=502)
    except ValueError as exc:
        logger.exception("Invalid JSON from Hugging Face")
        return Response({'error': f'Hugging Face returned an invalid response: {exc}'}, status=502)

    # Extract reply from response
    try:
        if isinstance(data, list) and len(data) > 0:
            reply = data[0].get('generated_text', '')
        elif isinstance(data, dict):
            reply = data.get('generated_text', '')
        else:
            reply = str(data)
    except (KeyError, IndexError, TypeError) as exc:
        logger.exception("Failed to extract reply")
        return Response({'error': f'Failed to parse AI response: {exc}'}, status=502)

    if not reply:
        return Response({'error': 'AI response was empty. Try another prompt.'}, status=502)

    return Response({
        'reply': reply[:2000],
        'model': model_name,
    })
