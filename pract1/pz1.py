# user_name = input("Введіть ваше ім'я: ")
# print(f"Привіт, {user_name}! Радий тебе бачити.")

numbers = list(range(1, 21))

print("Число | Його квадрат")
print("-" * 20)

for num in numbers:
    square = num ** 2
    print(f"{num:^5} | {square:^12}")
