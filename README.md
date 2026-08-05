# ☕ Coffee Blog - Редакционный сайт о кофе

Полнофункциональный веб-сайт о кофе с системой блога, авторизацией пользователей, комментариями и рейтингами.

## Функциональность

### Для пользователей
- 📖 Просмотр статей о различных сортах кофе
- 🔍 Поиск по статьям
- 🏷️ Фильтрация по сортам кофе (Арабика, Робуста, Либерика, Эксцельса) и регионам
- ❤️ Лайки на статьи
- 📌 Сохранение статей
- 💬 Комментарии к статьям
- ⭐ Рейтинги статей (1-5 звёзд)
- 📧 Подписка на новые статьи

### Для администраторов
- ✏️ Создание и редактирование статей
- 🖼️ Загрузка изображений
- 📝 Форматирование контента
- 🏷️ Управление тегами и категориями
- 🗑️ Удаление статей

## Технический стек

### Backend
- **Node.js + Express** - веб-сервер
- **MongoDB** - база данных
- **JWT** - авторизация
- **bcryptjs** - хеширование паролей
- **Multer** - загрузка файлов
- **nodemailer** - отправка писем

### Frontend
- **React 18** - UI фреймворк
- **React Router v6** - маршрутизация
- **Axios** - HTTP запросы
- **CSS3** - стилизация

## Установка и запуск

### Требования
- Node.js 14+
- MongoDB 4.4+

### 1. Клонирование и установка зависимостей

```bash
cd coffee-blog

# Установка backend зависимостей
npm install

# Установка frontend зависимостей
cd client
npm install
cd ..
```

### 2. Конфигурация

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env`:
```
MONGODB_URI=mongodb://localhost:27017/coffee-blog
JWT_SECRET=your_secure_secret_key_here
PORT=5000
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
```

### 3. Запуск MongoDB

```bash
# Локально (если установлен)
mongod

# Или используйте MongoDB Atlas (облачный сервис)
```

### 4. Запуск приложения

```bash
# Разработка (одновременно запускает server и client)
npm run dev

# Только сервер
npm run server

# Только клиент
npm run client

# Продакшн
npm run build
npm start
```

Приложение будет доступно по адресу:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход пользователя

### Статьи
- `GET /api/articles` - Получить все статьи (с фильтрацией)
- `GET /api/articles/:slug` - Получить одну статью
- `POST /api/articles` - Создать статью (только admin)
- `PUT /api/articles/:id` - Обновить статью (только admin)
- `DELETE /api/articles/:id` - Удалить статью (только admin)
- `POST /api/articles/:id/like` - Лайкнуть статью
- `POST /api/articles/:id/save` - Сохранить статью

### Комментарии
- `POST /api/comments` - Добавить комментарий
- `DELETE /api/comments/:id` - Удалить комментарий

## Структура проекта

```
coffee-blog/
├── server/
│   ├── config/
│   │   └── db.js                 # Конфигурация MongoDB
│   ├── models/
│   │   ├── User.js               # Модель пользователя
│   │   ├── Article.js            # Модель статьи
│   │   └── Comment.js            # Модель комментария
│   ├── middleware/
│   │   └── auth.js               # JWT авторизация
│   ├── routes/
│   │   ├── auth.js               # Маршруты авторизации
│   │   ├── articles.js           # Маршруты статей
│   │   └── comments.js           # Маршруты комментариев
│   └── index.js                  # Главный файл сервера
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js            # API запросы
│   │   ├── components/
│   │   │   └── Header.js         # Навигация
│   │   ├── context/
│   │   │   └── AuthContext.js    # Состояние авторизации
│   │   ├── pages/
│   │   │   ├── Home.js           # Главная страница
│   │   │   ├── ArticleDetail.js  # Страница статьи
│   │   │   ├── Login.js          # Вход
│   │   │   ├── Register.js       # Регистрация
│   │   │   └── AdminPanel.js     # Админ-панель
│   │   ├── styles/
│   │   │   ├── Home.css
│   │   │   ├── ArticleDetail.css
│   │   │   ├── Auth.css
│   │   │   ├── AdminPanel.css
│   │   │   ├── Header.css
│   │   │   └── App.css
│   │   ├── App.js                # Главное приложение
│   │   └── index.js              # Точка входа
│   └── package.json
├── .env.example
├── package.json
└── README.md
```

## Примеры использования

### Регистрация пользователя
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "password": "securePassword123"
}
```

### Создание статьи (админ)
```javascript
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Эфиопская Арабика - вкус древних гор",
  "excerpt": "Узнайте о уникальном вкусе кофе из Эфиопии",
  "content": "Полный текст статьи...",
  "category": "arabica",
  "region": "Эфиопия",
  "images": ["https://example.com/image1.jpg"],
  "tags": ["эфиопия", "арабика", "качество"],
  "published": true
}
```

### Добавление комментария с рейтингом
```javascript
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Отличная статья! Попробовал этот кофе - действительно вкусный.",
  "articleId": "article_id_here",
  "rating": 5
}
```

## Особенности

✨ **Профессиональный дизайн** - современный интерфейс с поддержкой мобильных устройств

🔐 **Безопасность** - JWT авторизация, хеширование паролей, валидация данных

🔍 **Полнотекстовый поиск** - поиск по названию и контенту статей

⭐ **Система рейтингов** - расчет среднего рейтинга на основе комментариев

📱 **Адаптивность** - оптимально работает на всех устройствах

💾 **Сохранение статей** - пользователи могут сохранять интересующие их статьи

## Лицензия

MIT License

## Контакты

По вопросам и предложениям пишите на наш email или создавайте issues в репозитории.

---

Приятного чтения о кофе! ☕
