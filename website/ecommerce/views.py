from django.contrib.auth import logout
from django.http import  HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from pyexpat.errors import messages
from rest_framework.response import Response
from rest_framework.decorators import  api_view
from rest_framework.views import APIView
from rest_framework import status
from .serializers import *


# Create your views here.
class Account(APIView):
    def get(self, request):
        user = Users.objects.filter(email=request.user.email)
        serializer = UserSerializer(user, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

def account(request):
    return render(request, 'account/profile.html')
def logout_view(request):
    logout(request)
    return redirect('login')
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


@api_view(['POST'])
def loginhandle(request):
    try:
        data = request.data
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            password = serializer.validated_data['password']
            user = Users.objects.filter(phone_number=phone_number, password=password)
            if user:

                request.session['id'] = user.first().id
                return Response({
                    "id": user.first().id,
                    "status": True,
                    "message": "Login Successful"
                })
            else:
                return Response({
                    "status": False,
                    "message": "Login Successful"
                })
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
       print(e)


