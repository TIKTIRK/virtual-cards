# Развёртывание Virtual Cards на Vercel + Neon

## Архитектура
- Frontend: React + Vite (Vercel).
- Backend: Python + FastAPI (Vercel Functions, точка входа `api/index.py`).
- ORM: SQLAlchemy 2.x.
- База: Neon PostgreSQL.

## 1. Переменные Vercel
В Project → Settings → Environments (Environment Variables) добавьте:

| Переменная | Значение |
|---|---|
| `DATABASE_URL` | Pooled connection string из Neon, с `sslmode=require` |
| `JWT_SECRET` | Случайный секрет не короче 32 символов |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `lax` |
| `COOKIE_NAME` | `session` |
| `ACCESS_TOKEN_MINUTES` | `60` |
| `VITE_USE_MOCK` | `false` |
| `VITE_API_URL` | `/api` |

Для `DATABASE_URL` используйте именно pooled URL (в имени хоста Neon обычно присутствует `-pooler`). Не добавляйте секреты с префиксом `VITE_`.

## 2. Создание таблиц Neon (один раз)
Перед первым Deploy или до включения реальной регистрации выполните миграцию локально из папки `backend`:

```bash
python -m pip install -r requirements.txt
# Создайте backend/.env по backend/.env.example и укажите pooled DATABASE_URL Neon
alembic -c alembic.ini upgrade head
```

Миграция создаст таблицу `users` и уникальные ограничения для email и телефона. Не вызывайте `create_all()` при запуске функции.

## 3. Deploy
После добавления переменных запустите новый Deploy из Vercel. `api/index.py` экспортирует FastAPI-приложение для Python Runtime. API-роуты имеют префикс `/api`, а `vercel.json` сохраняет SPA-маршрутизацию для клиентских страниц.

## 4. Проверка
Откройте `https://ВАШ-ДОМЕН/api/health`. Ожидаемый ответ: `{"status":"ok"}`. Затем проверьте регистрацию и вход.

## Локальный запуск
1. В `backend` создайте `.env` на основе `backend/.env.example`.
2. Установите зависимости: `pip install -r requirements.txt`.
3. Запустите API: `uvicorn app.main:app --app-dir backend --reload --port 8000`.
4. Для frontend задайте `VITE_USE_MOCK=false` и `VITE_API_URL=/api` в `.env.local`; Vite proxy перенаправит `/api` на локальный FastAPI.
