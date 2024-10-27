# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from dataclasses import dataclass

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.shortcuts import get_object_or_404
class Cart(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Cart'

@dataclass
class CartItemInformation:
    id: int
    product_id: int
    name: str
    image: str
    quantity: int
    price: float
    size: str
    color: str

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, models.DO_NOTHING, blank=True, null=True)
    products_sku = models.ForeignKey('ProductsSkus', models.DO_NOTHING, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Cart_Item'

    def get_cart_item_info(self) -> CartItemInformation:
        product = self.products_sku.product if self.products_sku else None
        size = None
        color = None

        if self.products_sku:
            try:
                attribute_values = ProductAttributesValues.objects.filter(products_sku=self.products_sku)
                for attr_value in attribute_values:
                    if attr_value.product_attribute.type == 'Size':
                        size = attr_value.value
                    elif attr_value.product_attribute.type == 'Color':
                        color = attr_value.value
            except ProductAttributesValues.DoesNotExist:
                pass
        return CartItemInformation(
            id=self.id,
            product_id=product.id,
            name=product.name if product else None,  # Ensure product exists before accessing name
            image=product.productimages_set.first().image if product and product.productimages_set.exists() else None,  # Ensure product exists and has images
            quantity=self.quantity,
            price=float(self.products_sku.price * self.quantity) if self.products_sku else 0.0,  # Ensure products_sku exists before calculating price
            size=size,
            color=color,
        )

class Categories(models.Model):
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    description = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Categories'


class OrderDetails(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    shipping_charge = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    province = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    district = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    ward = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    receiver_name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    receiver_phone = models.CharField(max_length=20, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    detail = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)  # This field type is a guess.
    created_at = models.DateTimeField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'Order_Details'


class OrderItem(models.Model):
    order = models.ForeignKey(OrderDetails, models.DO_NOTHING, blank=True, null=True)
    product = models.ForeignKey('Products', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    Color = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    Size = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'Order_Item'


class PaymentDetails(models.Model):
    order = models.ForeignKey(OrderDetails, models.DO_NOTHING, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_method = models.ForeignKey('PaymentMethods', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=20, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Payment_Details'


class PaymentMethods(models.Model):
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    description = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Payment_Methods'

@dataclass
class ProductInfo:
    id: int
    name: str
    image: str
    price: float

@dataclass
class ProductsDetails:
    id: int
    name: str
    images: list  # Changed to plural to indicate multiple images
    price: float
    description: str
    summary: str
    category: str
    subcategory: str
    attributes: dict  # Changed to a dictionary to hold multiple attributes
    quantity: int


# class ProductManager(models.Manager):
#     def get_product_info(self, product_id: int) -> ProductInfo:
#         """Retrieves product information for a given product ID."""
#         try:
#             product = self.get(pk=product_id)
#             return product.get_product_info()
#         except Products.DoesNotExist:
#             return None

class ProductAttributes(models.Model):
    type = models.CharField(unique=True, max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Product_Attributes'


class ProductAttributesValues(models.Model):
    products_sku = models.ForeignKey('ProductsSkus', models.DO_NOTHING, blank=True, null=True)
    product_attribute = models.ForeignKey(ProductAttributes, models.DO_NOTHING, blank=True, null=True)
    value = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Product_Attributes_Values'


class ProductImages(models.Model):
    product = models.ForeignKey('Products', models.DO_NOTHING, blank=True, null=True)
    image = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Product_Images'


class Products(models.Model):
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    description = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)  # This field type is a guess.
    summary = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    sub_category = models.ForeignKey('SubCategories', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Products'

    # objects = ProductManager()  # Use the custom manager

    def get_product_info(self) -> ProductInfo:
        """Returns a ProductInfo dataclass instance for this product."""
        image = self.productimages_set.first()  # Assuming related_name is "productimages_set"
        price_info = self.productsskus_set.first()  # Assuming related_name is "productsskus_set"

        return ProductInfo(
            id=self.id,
            name=self.name,
            image=image.image if image else None,
            price=price_info.price if price_info else 0,
        )
    def get_product_detail(self) -> ProductsDetails:
        images = self.productimages_set.all()
        price = self.productsskus_set.first()
        sub_category = self.sub_category  # ForeignKey relationship
        category = sub_category.parent if sub_category else None  # Get parent category if exists
        quantity = price.quantity if price else None  # Get quantity from price info
        attributes = {}
        for sku in self.productsskus_set.all():
            for attr_value in sku.productattributesvalues_set.all():
                attr_type = attr_value.product_attribute.type
                if attr_type not in attributes:
                    attributes[attr_type] = []
                attributes[attr_type].append(attr_value.value)
        return ProductsDetails(
            id=self.id,
            name=self.name,
            description=self.description,
            summary=self.summary,
            images=[image.image for image in images],
            price=price.price if price else None,
            subcategory=sub_category.name if sub_category else None,
            attributes= attributes,
            category=category.name if category else None,
            quantity=quantity
        )

class ProductsSkus(models.Model):
    product = models.ForeignKey(Products, models.DO_NOTHING, blank=True, null=True)
    sku = models.CharField(primary_key=True, max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Products_SKUs'

    @classmethod
    def get_sku(cls, product_id, color=None, size=None):
        try:
            product = get_object_or_404(Products, pk=product_id)

            # Start building the queryset
            skus = cls.objects.filter(product=product)

            # Add filters based on provided attributes
            if color:
                color_attribute_id = ProductAttributes.objects.get(type='Color').id
                skus = skus.filter(
                    productattributesvalues__product_attribute_id=color_attribute_id,
                    productattributesvalues__value=color
                )
            if size:
                size_attribute_id = ProductAttributes.objects.get(type='Size').id
                skus = skus.filter(
                    productattributesvalues__product_attribute_id=size_attribute_id,
                    productattributesvalues__value=size
                )

            return skus.first()  # Return the first matching SKU

        except (Products.DoesNotExist, ProductAttributes.DoesNotExist) as e:
            print(f"Error retrieving SKU: {e}")
            return None

class SubCategories(models.Model):
    parent = models.ForeignKey(Categories, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    description = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Sub_Categories'


class Users(models.Model):
    avatar = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    first_name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    last_name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    email = models.CharField(unique=True, max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS')
    password = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    birth_of_date = models.DateField(blank=True, null=True)
    phone_number = models.CharField(unique=True, max_length=20, db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Users'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150, db_collation='SQL_Latin1_General_CP1_CI_AS')

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS')
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100, db_collation='SQL_Latin1_General_CP1_CI_AS')

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=128, db_collation='SQL_Latin1_General_CP1_CI_AS')
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150, db_collation='SQL_Latin1_General_CP1_CI_AS')
    first_name = models.CharField(max_length=150, db_collation='SQL_Latin1_General_CP1_CI_AS')
    last_name = models.CharField(max_length=150, db_collation='SQL_Latin1_General_CP1_CI_AS')
    email = models.CharField(max_length=254, db_collation='SQL_Latin1_General_CP1_CI_AS')
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS', blank=True, null=True)
    object_repr = models.CharField(max_length=200, db_collation='SQL_Latin1_General_CP1_CI_AS')
    action_flag = models.SmallIntegerField()
    change_message = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS')
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100, db_collation='SQL_Latin1_General_CP1_CI_AS')
    model = models.CharField(max_length=100, db_collation='SQL_Latin1_General_CP1_CI_AS')

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS')
    name = models.CharField(max_length=255, db_collation='SQL_Latin1_General_CP1_CI_AS')
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40, db_collation='SQL_Latin1_General_CP1_CI_AS')
    session_data = models.TextField(db_collation='SQL_Latin1_General_CP1_CI_AS')
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


