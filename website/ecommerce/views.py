from django.contrib.auth import logout
from django.db import transaction
from django.http import  HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import  api_view
from rest_framework import status
from .serializers import *

def profile(request):
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
    if  request.session.session_key:
         return render(request, 'order/checkout.html')
    else: return redirect('login')
def detail(request, product_name):
    return render(request, 'product/detail.html')

@api_view(['POST'])
def login_handle(request):
    try:
        data = request.data
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            user = Users.objects.filter(**serializer.validated_data)
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

@api_view(['POST'])
def register_handle(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        try:
            user = Users(**serializer.validated_data) # Set the hashed password directly
            user.save()
            return Response({"status": True, "message": "Registration successful"}, status=status.HTTP_201_CREATED)
        except Exception as e: # Handle potential database errors during user creation
            print(f"Error during user creation: {e}")
            return Response({"status": False, "error": "An error occurred during registration."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_products_info(request):
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


@api_view(['GET'])
def get_product_detail(request,id):
    try:
        product = Products.objects.get(id=id)
        product_detail = product.get_product_detail()
        serializer = ProductDetailSerializer(product_detail, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_cart(request, id):
    try:
        cart_client = Cart.objects.filter(user_id=id).first()
        if not cart_client:
            return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_id = cart_client.id
        all_items = CartItem.objects.filter(cart_id=cart_id)
        
        if not all_items.exists():
            return Response({'error': 'No items in cart'}, status=status.HTTP_404_NOT_FOUND)
        
        cart_items_info_list = [
            item.get_cart_item_info() for item in all_items
        ]
        serializer = CartItemSerializer(cart_items_info_list, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_cart_item(request, id):
    try:
        cart_item = CartItem.objects.filter(id=id).first()
        if not cart_item:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_to_cart(request, id):
    cart_client, created = Cart.objects.get_or_create(user_id=id)  # Get or create cart
    if created:
        cart_client.total = 0  # Set initial total or other fields as needed
        cart_client.save()
    data = request.data
    if isinstance(data, dict):  # Single product
        products_data = [data]  # Wrap in a list for consistent processing
    elif isinstance(data, list) and all(isinstance(item, dict) for item in data):  # List of products
        products_data = data
    else:
        return HttpResponse("Invalid request data: Must be a product dictionary or a list of product dictionaries",
                            status=status.HTTP_400_BAD_REQUEST)

    success_count = 0
    for product_data in products_data:
        try:
            product_id = product_data.get('product_id')
            color = product_data.get('color')
            size = product_data.get('size')
            quantity = int(product_data.get('quantity', 1))

            selected_sku = ProductsSkus.get_sku(product_id, color=color, size=size)

            if selected_sku:
                with transaction.atomic():
                    cart_item, created = CartItem.objects.get_or_create(
                        cart=cart_client,
                        products_sku=selected_sku,
                        defaults={'quantity': 0}
                    )
                    cart_item.quantity += quantity
                    cart_item.save()
                    success_count += 1
            else:
                print(f"SKU not found for product ID: {product_id}, color: {color}, size: {size}")
                # Consider adding error details to a response list for better feedback

        except (Products.DoesNotExist, ProductsSkus.DoesNotExist, ProductAttributes.DoesNotExist) as e:
            print(f"Error retrieving product or SKU: {e}")
            # Consider adding error details to a response list for better feedback

    if success_count == len(products_data):
        return HttpResponse("All products added to cart successfully", status=status.HTTP_200_OK)
    elif success_count > 0:
        return HttpResponse("Some products added to cart, check for errors", status=status.HTTP_206_PARTIAL_CONTENT)
    else:
        return HttpResponse("Error adding products to cart", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
