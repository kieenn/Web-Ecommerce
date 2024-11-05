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
]