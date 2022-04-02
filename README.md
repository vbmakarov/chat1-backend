# Чат с JWT авторизацией (backend)

Для создания использованы следующие основные библиотеки:
+ Express + TypeScript
+ Express-fileupload
+ Mongoose
+ Multer
+ Socket.io
+ jsonwebtoken

## Запуск приложения:
Фронтенд тут : https://github.com/vbmakarov/chat1-frontend

Для VPS:
1.  Подключить удаленную базу данных MongoDB в файле src/config/config.ts
    Заменить в файле .env CLIENT_HOST на адрес VPS сервера
    Произвести настройку proxy nginx conf VPS сервера

Для localhost:
2. Перейти в корень npm start или yarn start
Приложение запустится на http://localhost:5000
