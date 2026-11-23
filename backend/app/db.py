from sqlalchemy import create_engine
# create_engine создаёт «движок»: управляет соединениями с БД
from sqlalchemy.orm import DeclarativeBase, sessionmaker
# DeclarativeBase нужен для описания таблиц классами,
# sessionmaker создаёт сессии (одну на каждый запрос)

from app.config import settings

# движок подключается по адресу из .env;
# pool_pre_ping проверяет, что соединение живое, перед использованием
engine = create_engine(settings.database_url, pool_pre_ping=True)

# фабрика сессий; autoflush=False: изменения уходят в БД только по commit
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    # от этого класса наследуются все модели таблиц
    pass


def get_db():
    db = SessionLocal()   # открыть сессию на время одного запроса
    try:
        yield db          # отдать её эндпоинту
    finally:
        db.close()        # закрыть после ответа, даже если была ошибка