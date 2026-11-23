from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # значения читаются из файла .env (имена: DATABASE_URL, JWT_SECRET, ...)
    model_config = SettingsConfigDict(env_file=".env")

    database_url: str                       # адрес PostgreSQL
    jwt_secret: str                         # секрет для подписи токена сессии
    access_token_minutes: int = 60          # сколько живёт сессия
    cors_origins: list[str] = ["http://localhost:5173"]   # адреса сайта, которым можно обращаться к API

    cookie_name: str = "session"            # имя куки с токеном
    cookie_secure: bool = False             # True: кука только по HTTPS (нужно на боевом стенде)
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"  # none: сайт и API на разных доменах


# один общий объект настроек
settings = Settings()