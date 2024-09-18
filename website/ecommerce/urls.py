from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('prodcucts/', views.products, name='products'),
]