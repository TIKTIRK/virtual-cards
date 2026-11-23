import uuid

import phonenumbers
from pydantic import (
    BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator,
)


def normalize_phone(raw: str) -> str:
    """Приводит номер к виду +79001234567, иначе ValueError."""
    try:
        number = phonenumbers.parse(raw, "RU")   # "RU": если код страны не указан, считаем Россией
    except phonenumbers.NumberParseException:
        raise ValueError("Некорректный номер телефона")
    # is_possible_number проверяет длину; is_valid_number строже (реальные диапазоны операторов)
    if not phonenumbers.is_valid_number(number):  # такой номер существует?
        raise ValueError("Некорректный номер телефона")
    return phonenumbers.format_number(number, phonenumbers.PhoneNumberFormat.E164)

def _empty_to_none(v):
    # пустую строку и пробелы считаем «не указано»
    if isinstance(v, str):
        v = v.strip()
        return v or None
    return v


class RegisterIn(BaseModel):
    """Тело POST /auth/register (поля как в src/api/real.js)."""
    # что фронтенд присылает при регистрации
    full_name: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None
    phone: str | None = None
    password: str = Field(min_length=8, max_length=128)
    consent: bool                         # галочка согласия, обязательная

    @field_validator("full_name", "email", "phone", mode="before")
    @classmethod
    def empty_to_none(cls, v):
        return _empty_to_none(v)

    @field_validator("email")
    @classmethod
    def lower_email(cls, v):
        # email храним в нижнем регистре
        return v.lower() if v else v

    @field_validator("phone")
    @classmethod
    def check_phone(cls, v):
        # если телефон указан, проверяем и нормализуем
        return normalize_phone(v) if v else v

    @field_validator("password")
    @classmethod
    def check_password(cls, v):
        # хотя бы одна буква и хотя бы одна цифра
        if not (any(c.isalpha() for c in v) and any(c.isdigit() for c in v)):
            raise ValueError("Пароль должен содержать буквы и цифры")
        return v

    @field_validator("consent")
    @classmethod
    def check_consent(cls, v):
        if not v:
            raise ValueError("Нужно согласие на обработку данных")
        return v

    @model_validator(mode="after")
    def check_contacts(self):
        if not self.email and not self.phone:
            raise ValueError("Укажите email или телефон")
        return self


class UserOut(BaseModel):
    # что мы возвращаем в ответ; пароля здесь нет
    model_config = ConfigDict(from_attributes=True)   # можно собирать из объекта User

    id: uuid.UUID
    full_name: str | None
    email: str | None
    phone: str | None


class LoginIn(BaseModel):
    """Тело POST /auth/login: фронт шлёт либо email, либо phone (splitLogin)."""
    email: str | None = None
    phone: str | None = None
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email", "phone", mode="before")
    @classmethod
    def empty_to_none(cls, v):
        return _empty_to_none(v)

    @model_validator(mode="after")
    def check_login(self):
        if not self.email and not self.phone:
            raise ValueError("Введите почту или телефон")
        return self


class UserEnvelope(BaseModel):
    """Ответы имеют вид {"user": {...}} — так читает фронт (data.user)."""
    user: UserOut