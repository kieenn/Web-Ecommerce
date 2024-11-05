from rest_framework import serializers
from rest_framework.serializers import ListSerializer
from dashboard.models import Users, OrderDetails


class ProductsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    subcategory = serializers.CharField()
    category = serializers.CharField()
    created_at = serializers.DateTimeField()

class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    birth_of_date = serializers.DateField()
    created_at = serializers.DateTimeField()

class InventorySerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    image = serializers.CharField(allow_null=True)
    name = serializers.CharField()
    sku = serializers.CharField()
    quantity = serializers.IntegerField()
    price = serializers.IntegerField()
    created_at = serializers.DateTimeField()


class OrderSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    user_id = serializers.IntegerField()
    user_name = serializers.CharField()
    receiver_name = serializers.CharField()
    receiver_phone = serializers.CharField()
    detail = serializers.CharField()
    ward = serializers.CharField()
    district = serializers.CharField()
    province = serializers.CharField()
    total = serializers.IntegerField()
    created_at = serializers.DateTimeField()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()