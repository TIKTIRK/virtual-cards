from sqlalchemy import create_engine
# create_engine создаёт «движок»: управляет соединениями с БД
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool
# DeclarativeBase нужен для описания таблиц классами,
# sessionmaker создаёт сессии (одну на каждый запрос)

from app.config import settings

# движок подключается по адресу из .env;
# pool_pre_ping проверяет, что соединение живое, перед использованием
# Vercel Functions are serverless: do not keep a process-local connection pool
# alive between invocations. Neon pooled URLs should be used in DATABASE_URL.
database_url = settings.database_url
if database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg://", 1)

engine = create_engine(
    database_url,
    poolclass=NullPool,
    pool_pre_ping=True,
)

# фабрика сессий; autoflush=False: изменения уходят в БД только по commit
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    # от этого класса наследуются все модели таблиц
    pass


def get_db():
    db = SessionLocal()   # открыть сессию на время одного запроса
    try:
        yield db          # отдать её эндпоинту
    finally:
        db.close()        # закрыть после ответа, даже если была ошибка