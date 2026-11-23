import uuid

import jwt
from fastapi import Cookie, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.errors import api_error
from app.models import User
from app.security import decode_access_token


def get_current_user(
    session: str | None = Cookie(default=None, alias=settings.cookie_name),
    db: Session = Depends(get_db),
) -> User:
    """Достаёт пользователя по токену из куки; без валидной куки отвечает 401."""
    unauthorized = api_error(401, "UNAUTHORIZED", "Нужно войти в аккаунт")
    if not session:
        raise unauthorized
    try:
        payload = decode_access_token(session)     # проверка подписи и срока
        user_id = uuid.UUID(payload["sub"])
    except (jwt.PyJWTError, ValueError):
        raise unauthorized
    user = db.get(User, user_id)
    if user is None:
        raise unauthorized
    return user