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


def checkout(request):
    return render(request, 'order/checkout.html')

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
                    "message": "Login Failed"
                })
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
       print(e)


@api_view(['GET'])
def getProductsInfo(request):
    """API endpoint to retrieve a list of product information."""
    try:
        # If you want to get ALL products:
        all_products = Products.objects.all()

        # Or, if you want to filter products (e.g., by category):
        # category_id = request.query_params.get('category', None)
        # all_products = Products.objects.filter(category=category_id) if category_id else Products.objects.all()

        product_info_list = [
            product.get_product_info() for product in all_products
        ]

        serializer = ProductInfoSerializer(product_info_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        # Handle any potential exceptions here (e.g., database errors)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def detail(request, product_name):
    return render(request, 'product/detail.html')

@api_view(['GET'])
def getProductDetail(request,id):
    try:
        product = Products.objects.get(id=id)
        product_detail = product.get_product_detail()
        serializer = ProductDetailSerializer(product_detail, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


