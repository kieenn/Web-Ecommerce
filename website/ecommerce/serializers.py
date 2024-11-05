
from rest_framework import serializers
from rest_framework.serializers import ListSerializer
from rest_framework.validators import UniqueValidator

from .models import *
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'birth_of_date']

class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()

class PhoneNumberAndEmailSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    email = serializers.EmailField()

class ProductInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    attributes = serializers.DictField()
    subcategory = serializers.CharField()
    category = serializers.CharField()

class ProductDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    images = serializers.ListField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    quantity = serializers.IntegerField()
    attributes = serializers.DictField()
    description = serializers.CharField()
    summary = serializers.CharField()
    subcategory = serializers.CharField()
    category = serializers.CharField()

class CartItemSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    product_id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    size = serializers.CharField()
    color = serializers.CharField()

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetails
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class PaymentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentDetails
        fields = '__all__'

class MyOrderSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    user_name = serializers.CharField()
    receiver_name = serializers.CharField()
    receiver_phone = serializers.CharField()
    detail = serializers.CharField()
    ward = serializers.CharField()
    district = serializers.CharField()
    province = serializers.CharField()
    total = serializers.IntegerField()
    created_at = serializers.DateTimeField()