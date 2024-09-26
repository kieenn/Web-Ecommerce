from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import  api_view
from rest_framework.views import APIView


# Create your views here.
def index(request):
    return render(request, 'home/index.html')

def products(request):
    return render(request, 'product/index.html')

def about(request):
    return render(request, 'about/index.html')

def contact(request):
    return render(request, 'contact/index.html')

def login(request):
    return render(request, 'account/login.html')

def register(request):
    return render(request, 'account/signup.html')

def cart(request):
    return render(request, 'cart/index.html')

def detail(request):
    return render(request, 'product/detail.html')