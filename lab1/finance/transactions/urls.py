from django.urls import path
from . import views

urlpatterns = [
    path('', views.category_transactions, name='category_transactions'),
]