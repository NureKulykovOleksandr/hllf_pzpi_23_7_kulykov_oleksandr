from django.shortcuts import render
from .models import Category

def category_transactions(request):
    """Контролер для виведення транзакцій, згрупованих за категоріями."""
    categories = Category.objects.all()
    
    context = {
        'categories': categories
    }
    return render(request, 'transactions/by_category.html', context)