from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('shop/', views.products, name='products'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('cart/', views.cart, name='cart'),
    path('login/post', views.loginhandle, name='login handle'),
    path('logout/', views.logout_view, name='logout_view'),
    path('profile/', views.profile, name='profile'),
    path('checkout/', views.checkout, name='checkout'),
    path('products/get', views.getProductsInfo, name='getProductsInfo'),
     path('products/detail/<product_name>/', views.detail, name='detail'),
    path('products/detail/get/<id>/', views.getProductDetail, name='getProductDetail'),
    path('cart/get/<id>/', views.getCart, name='getCart'),
    path('cart/delete/<id>/', views.deleteCartItem, name='deleteCartItem'),
]