import uuid
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

from app.config import settings

_hasher = PasswordHasher()   # Argon2id
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    # пароль -> хэш вида $argon2id$...; соль внутри, обратно не расшифровать
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    # True, если пароль подходит к хэшу
    try:
        return _hasher.verify(password_hash, password)
    except (VerificationError, InvalidHashError):
        return False


# Хэш-пустышка: пароль проверяется и для несуществующего логина,
# чтобы по времени ответа нельзя было понять, есть ли такой аккаунт.
DUMMY_HASH = hash_password("dummy-password-1")


def create_access_token(user_id: uuid.UUID, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),   # чей токен
        "role": role,
        "iat": now,            # когда выдан
        "exp": now + timedelta(minutes=settings.access_token_minutes),  # когда истекает
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    # проверяет подпись и срок; при подделке или просрочке бросает jwt.PyJWTError
    return jwt.decode(
        token,
        settings.jwt_secret,
        algorithms=[ALGORITHM],
        options={"require": ["exp", "sub"]},
    )
