"""
Views for myapp.
Simple homepage with "Hello World" message.
"""
from django.shortcuts import render
from django.http import HttpResponse


def home(request):
    """Simple Hello World view."""
    return HttpResponse("Hello World")


def home_template(request):
    """Hello World view using a template."""
    return render(request, 'home.html')

