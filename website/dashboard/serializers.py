from rest_framework import serializers
from rest_framework.serializers import ListSerializer
from dashboard.models import *


class ProductsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    subcategory = serializers.CharField()
    category = serializers.CharField()
    created_at = serializers.DateTimeField()
    status = serializers.IntegerField()

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
    status = serializers.IntegerField()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class AddProductSerializer(serializers.Serializer):
    name = serializers.CharField()
    image = serializers.ListField()
    sub_category_id = serializers.IntegerField()
    description = serializers.CharField()
    summary = serializers.CharField()

class SubCategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class CategorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class AddSubCategorySerializer(serializers.ModelSerializer): #Change to ModelSerializer
    class Meta:
        model = SubCategories
        fields = ['name', 'description', 'parent_id']

class AddCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ['name', 'description']

class ProductDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    images = serializers.ListField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    quantity = serializers.IntegerField()
    attributes = serializers.DictField()
    description = serializers.CharField()
    summary = serializers.CharField()
    subcategory = serializers.IntegerField()
    category = serializers.IntegerField()

class AddSkuSerializer(serializers.Serializer):
    sku = serializers.CharField()
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    color = serializers.CharField()
    size = serializers.IntegerField()
    product_id = serializers.IntegerField()

class UpdateOrderSerializer(serializers.Serializer):
    receiver_name = serializers.CharField()
    receiver_phone = serializers.CharField()
    detail = serializers.CharField()
    ward = serializers.CharField()
    district = serializers.CharField()
    province = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'birth_of_date', 'password','gender']
