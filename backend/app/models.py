import uuid                       # для идентификаторов UUID
from datetime import datetime

from sqlalchemy import DateTime, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class User(Base):
    """Класс описывает таблицу users"""
    
    __tablename__ = "users"       # имя таблицы в БД

    # первичный ключ; если id не задан, Python сам создаст случайный UUID
    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    # str | None значит «может быть пустым» (NULL в БД)
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True)
    password_hash: Mapped[str] = mapped_column(Text)        # обязательное поле
    full_name: Mapped[str | None] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(10), default="user")  # по умолчанию 'user'
    # время согласия на обработку ПДн, с часовым поясом
    consent_pd_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    # время создания проставляет сама БД (функция now())
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )