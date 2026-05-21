from django.db import models

class Category(models.Model):
    """Модель для Рівня 2: Категорія транзакції"""
    name = models.CharField(max_length=100, verbose_name="Назва категорії")

    def __str__(self):
        return self.name

class Transaction(models.Model):
    """Модель для Рівня 1 та 2: Транзакція"""
    TRANSACTION_TYPES = [
        ('debit', 'Дебет (Надходження)'),
        ('credit', 'Кредит (Витрата)'),
    ]

    description = models.CharField(max_length=255, verbose_name="Опис")
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Сума")
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, verbose_name="Тип")
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Категорія")

    def __str__(self):
        return f"{self.description} | {self.amount} ₴ ({self.get_transaction_type_display()})"