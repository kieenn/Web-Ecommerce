from django.contrib.auth import logout
from django.db import transaction
from django.db.models import Q
from django.http import  HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status

from dashboard.serializers import OrderSerializer
from .serializers import *
# from rest_framework_api_key.permissions import HasAPIKey
def profile(request):
    return render(request, 'account/profile.html')
def logout_view(request):
    logout(request)
    return redirect('ecommerce:login')
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
def myOrders(request):
    return render(request, 'order/myOrder.html')
def checkout(request):
    user_id = request.session.get('user')  # Use .get() to avoid KeyError
    if user_id:
        # You might want to retrieve the full user object here if you need more than just the id
        # user = User.objects.get(pk=user_id)
        return render(request, 'order/checkout.html')
    else:
        return redirect('ecommerce:login')
def detail(request, product_name):
    return render(request, 'product/detail.html')
def order_success (request):
    return render(request, 'order/success.html')
def myOrderDetail(request):
    return render(request, 'order/orderDetail.html')
@api_view(['POST'])
def login_handle(request):
    try:
        data = request.data
        serializer = LoginSerializer(data=data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            password = serializer.validated_data['password']

            try:
                user = Users.objects.get(phone_number=phone_number)
            except Users.DoesNotExist:
                return Response({
                    "status": False,
                    "message": "Login Failed - User not found."
                }, status=status.HTTP_400_BAD_REQUEST)

            if user.password == password:
                request.session['user'] = user.id
                return Response({
                    "id": user.id,
                    "status": True,
                    "message": "Login Successful",
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status": False,
                    "message": "Login Failed - Incorrect password."
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        all_products = Products.objects.filter(
            Q(productsskus__isnull=False)
        )
        all_products = set(all_products)

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


@api_view(["POST"])
def order(request, id):
    user = Users.objects.get(id=id)

    # Get order details from request data
    receiver_name = request.data.get('receiver_name')
    receiver_phone = request.data.get('receiver_phone')
    province = request.data.get('province')
    district = request.data.get('district')
    ward = request.data.get('ward')
    total = request.data.get('total')
    detail_address = request.data.get('detail')
    sub_total = request.data.get('sub_total')
    shipping_charge = request.data.get('shipping_charge')
    # Create the order details
    order_detail_data = {
        'user': user.id,  # Use user.id, not the user object directly
        'receiver_name': receiver_name,
        'receiver_phone': receiver_phone,
        'province': province,
        'district': district,
        'ward': ward,
        'total': total,
        'detail': detail_address,
        'sub_total': sub_total,
        'shipping_charge': shipping_charge,
    }
    order_detail_serializer = OrderDetailSerializer(data=order_detail_data)

    # Get the products data (list of product details)
    cart_items = request.data.get('products')
    name_payment_method = PaymentMethods.objects.get(name=request.data.get('payment_method'))
    status_payment = request.data.get('status')
    print(name_payment_method.id)



    if order_detail_serializer.is_valid():
        try:
            with transaction.atomic():  # Ensure data integrity
                order_detail = order_detail_serializer.save()

                payment_detail_data = {
                    'order': order_detail.id,
                    'amount': order_detail.total,
                    'payment_method': name_payment_method.id,
                    'status': status_payment
                }
                payment_detail_serializer = PaymentDetailSerializer(data=payment_detail_data)
                if payment_detail_serializer.is_valid():
                    payment_detail_serializer.save()
                else:
                    # Handle invalid payment detail (e.g., log errors)
                    return Response(payment_detail_serializer.errors, status=400)

                # Create and save the order items
                for product_data in cart_items:
                    # Assuming product_data has product_id, quantity, etc.
                    order_item_data = {
                        'order': order_detail.id,
                        'product': product_data.get('product_id'),
                        'name': product_data.get('name'),
                        'quantity': product_data.get('quantity'),
                        'price': product_data.get('price'),
                        'Color': product_data.get('color'),
                        'Size': product_data.get('size'),
                    }
                    order_item_serializer = OrderItemSerializer(data=order_item_data)
                    if order_item_serializer.is_valid():
                        order_item_serializer.save()
                    else:
                        # Handle invalid order item data (e.g., log errors)
                        return Response(order_item_serializer.errors, status=400)
                cart_client = Cart.objects.get(user_id=id)
                CartItem.objects.filter(cart_id=cart_client.id).delete()
                return Response(order_detail_serializer.data, status=201)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    else:
        return Response(order_detail_serializer.errors, status=400)

@api_view(["GET"])
def get_profile(request, id):
    try:
        user = Users.objects.get(id=id)  # This will raise an exception if user is not found
        serializer = UserInfoSerializer(user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    except Users.DoesNotExist:  # Handle the specific exception
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:  # Catch other potential errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def change_password(request, id):
    try:
        user = Users.objects.get(id=id)

        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            # Check if the old password matches
            if user.check_password(serializer.data.get('old_password')):
                # Hash the new password before saving
                user.password = (serializer.data.get('new_password'))
                user.save()
                return Response({"message": "Password changed successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Incorrect old password."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def forgot_password(request):
    try:
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
           phone_number = serializer.data.get('phone_number')
           password = serializer.data.get('password')
           try:
               user = Users.objects.get(phone_number=phone_number)
               if user:
                   user.password = password
                   user.save()
                   return Response({"message": "Password changed successfully!"}, status=status.HTTP_200_OK)
               else:
                   return Response({"message": "Incorrect phone number."}, status=status.HTTP_400_BAD_REQUEST)
           except Users.DoesNotExist:
               return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def verification(request):
    try:
        serializer = PhoneNumberAndEmailSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']  # Use validated data
            email = serializer.validated_data['email']
            try:
                user = Users.objects.get(phone_number=phone_number, email=email)
                if user:
                    # User found, handle verification logic here (e.g., send an OTP)
                    return Response({"message": "Verified."}, status=status.HTTP_200_OK)
                else:
                    return Response({"message": "Incorrect phone number."}, status=status.HTTP_400_BAD_REQUEST)
            except Users.DoesNotExist:
                # User not found, you might want to handle this differently
                return Response({"message": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_my_orders(request, id):
    try:
        orders = get_orders_by_user_id(id)
        serializer = MyOrderSerializer(orders, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



