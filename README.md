Этот проект предстваляет собой онлайн-магазин, созданный в рамках учебного курса.

Перечень функциональных возможностей:
* Регистрация и авторизация в одной из ролей (покупатель, менеджер, администратор)
* Создание, редактирование или удаление карточки товара с возможностью загрузить его изображение
* Возможность добавить товар в корзину
* Поиск товаров по названию или его части

Инструкция по установке и запуску:
1. Backend:
    1. Склонируйте код проекта из репозитория: git clone https://github.com/flear-feler/OnlineShop.git
    2. Перейдите в папку \OnlineShop\forum_backend
    3. Создайте виртуальное окружение: python -m venv venv
    4. Активируйте виртуальное окружение: venv\Scripts\activate.bat
    5. В терминале выполните: pip install poetry
    6. В терминале выполните: poetry install
    7. Установите и настройте [PostgreSQL](https://www.postgresql.org/download/), Внесите имя и пароль пользователя в файл \OnlineShop\forum_backend\.env
    8. В терминале выполните: mysql -u <имя_пользователя> -p -e "CREATE DATABASE <имя БД> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;". Внесите имя БД в файл .env из предыдущего шага
    9. В терминале выполните: alembic revision --autogenerate -m "Initial database setup"
    10. В терминале выполните: alembic upgrade head
    11. Запустите на выполнение файл main.py
2. Frontend:
    1. Перейдите в папку \OnlineShop\forum_backend
    2. В терминале выполните: npm start
3. Swagger проекта будет доступен по адресу http://127.0.0.1:8000/docs, сам проект откроется по адресу http://127.0.0.1:8000/web/MainPage
