from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('products/', views.products, name='products'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('cart/', views.cart, name='cart'),
    path('products/detail', views.detail, name='detail'),
    path('loginhandle/', views.loginhandle, name='loginhandle'),
    path('logout/', views.logout_view, name='logout_view'),
    path('account/', views.account, name='account'),
    path('checkout/', views.checkout, name='checkout'),
]