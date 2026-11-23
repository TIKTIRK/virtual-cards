from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.errors import rate_limit_handler, validation_handler
from app.limiter import limiter
from app.routers import auth

app = FastAPI(title="Virtual Cards API")

app.state.limiter = limiter                                   # подключаем ограничитель
app.add_exception_handler(RateLimitExceeded, rate_limit_handler)         # 429 в формате фронта
app.add_exception_handler(RequestValidationError, validation_handler)    # 422 в формате фронта

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,   # конкретные адреса сайта (не "*": иначе куки не работают)
    allow_credentials=True,                # разрешаем передавать куки между сайтом и API
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")


@app.get("/api/health", tags=["service"])
def health():
    return {"status": "ok"}