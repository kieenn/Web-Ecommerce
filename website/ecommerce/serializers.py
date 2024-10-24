from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.serializers import ListSerializer
from rest_framework.validators import UniqueValidator

from .models import *
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField()



class ProductInfoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)

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
    name = serializers.CharField()
    image = serializers.CharField(allow_null=True)
    quantity = serializers.IntegerField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)
    size = serializers.CharField()
    color = serializers.CharField()