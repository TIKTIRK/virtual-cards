from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.deps import get_current_user
from app.errors import api_error
from app.limiter import limiter
from app.models import User
from app.schemas import LoginIn, RegisterIn, UserEnvelope, UserOut, normalize_phone
from app.security import (
    DUMMY_HASH, create_access_token, hash_password, verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def _envelope(user: User) -> UserEnvelope:
    return UserEnvelope(user=UserOut.model_validate(user))


def _set_session_cookie(response: Response, user: User) -> None:
    """Кладёт токен в HttpOnly-куку: JavaScript сайта её прочитать не может."""
    response.set_cookie(
        key=settings.cookie_name,
        value=create_access_token(user.id, user.role),
        max_age=settings.access_token_minutes * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite,
        path="/",
    )


@router.post("/register", response_model=UserEnvelope, status_code=201)
def register(data: RegisterIn, response: Response, db: Session = Depends(get_db)):
    if data.email and db.scalar(select(User).where(func.lower(User.email) == data.email)):
        raise api_error(409, "EMAIL_TAKEN", "Этот email уже зарегистрирован")
    if data.phone and db.scalar(select(User).where(User.phone == data.phone)):
        raise api_error(409, "PHONE_TAKEN", "Этот телефон уже зарегистрирован")

    user = User(
        email=data.email,
        phone=data.phone,
        full_name=data.full_name,
        password_hash=hash_password(data.password),
        consent_pd_at=datetime.now(timezone.utc),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:   # двое одновременно заняли один email/телефон
        db.rollback()
        raise api_error(409, "CONFLICT", "Пользователь с такими данными уже существует")
    db.refresh(user)

    _set_session_cookie(response, user)   # после регистрации пользователь сразу вошёл
    return _envelope(user)


def _find_user(db: Session, data: LoginIn) -> User | None:
    if data.email:
        return db.scalar(select(User).where(func.lower(User.email) == data.email.lower()))
    try:
        phone = normalize_phone(data.phone)
    except ValueError:
        return None
    return db.scalar(select(User).where(User.phone == phone))


@router.post("/login", response_model=UserEnvelope)
@limiter.limit("5/minute")   # защита от перебора пароля: 5 попыток в минуту с одного IP
def login(request: Request, response: Response, data: LoginIn, db: Session = Depends(get_db)):
    user = _find_user(db, data)
    # пароль проверяется всегда, даже если пользователя нет
    ok = verify_password(data.password, user.password_hash if user else DUMMY_HASH)
    if user is None or not ok:
        raise api_error(401, "INVALID_CREDENTIALS", "Неверная почта, телефон или пароль")
    _set_session_cookie(response, user)
    return _envelope(user)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key=settings.cookie_name,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite=settings.cookie_samesite,
    )
    return {"ok": True}


@router.get("/me", response_model=UserEnvelope)
def me(user: User = Depends(get_current_user)):
    # без валидной куки get_current_user вернёт 401, фронт воспримет это как «не вошёл»
    return _envelope(user)
