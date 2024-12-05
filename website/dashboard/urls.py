from django.urls import path

from dashboard import views

app_name = 'dashboard'
urlpatterns = [
    path('', views.home, name='dashboard'),
    path('login/', views.dashboard_login, name='dashboard_login'),
    path('login/post', views.login_handle, name='login_handle'),
    path('logout/', views.logout, name='logout'),
    path('products/', views.products, name='products'),
    path('products/get', views.get_products, name='get_products'),
    path('users/', views.users, name='users'),
    path('users/get', views.get_users, name='get_users'),
    path('inventory/', views.inventory, name='inventory'),
    path('inventory/get', views.get_inventory, name='get_inventory'),
    path('orders/', views.orders, name='orders'),
    path('orders/get', views.get_orders, name='get_orders'),
    path('products/add', views.add_product, name='add_product'),
    path('subcategory/get/<id>', views.get_subCategory, name='get_subCategory'),
    path('category/get', views.get_categories, name='get_category'),
    path('subcategory/add', views.add_subCategory, name='add_subCategory'),
    path('category/add', views.add_category, name='add_category'),
    path('products/status/update', views.update_product_status, name='product_status'),
    path('products/detail/<product_id>', views.product_details, name='product_details'),
    path('products/update/<pk>', views.update_product_details, name='update_product_details'),
    path('sku/add', views.add_sku, name='add_sku'),
    path('sku/delete/<id>', views.delete_sku, name='delete_sku'),
    path('sku/get/<sku>', views.get_sku_detail, name='get_sku_detail'),
    path('sku/update/<sku_id>', views.update_sku, name='update_sku'),
    path('order/status/update', views.update_order_status, name='update_order_status'),
    path('order/detail/<order_id>', views.get_order_detail, name='get_order_detail'),
    path('order/update/<order_id>', views.update_order_info, name='update_order_info'),
    path('user/add', views.add_user, name='add_user'),
    path('user/get/<id>', views.get_profile, name='get_profile'),
    path('user/update/<id>', views.update_profile, name='update_profile'),
]