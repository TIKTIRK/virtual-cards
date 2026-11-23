"""Формат ошибок, который ждёт фронтенд (src/api/errors.js):
   {"detail": {"code": "...", "message": "...", "fields": {"имя_поля": "текст"}}}
"""
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


def api_error(status: int, code: str, message: str, fields: dict | None = None) -> HTTPException:
    return HTTPException(
        status_code=status,
        detail={"code": code, "message": message, "fields": fields or {}},
    )


# Русские тексты для стандартных ошибок Pydantic
GENERIC = {
    "missing": "Обязательное поле",
    "string_too_short": "Слишком короткое значение",
    "string_too_long": "Слишком длинное значение",
}
BY_FIELD_AND_TYPE = {
    ("password", "string_too_short"): "Пароль — минимум 8 символов",
}
BY_FIELD = {
    "email": "Введите корректный email",
    "phone": "Введите корректный номер телефона",
}


async def validation_handler(request: Request, exc: RequestValidationError):
    """Превращает 422 от FastAPI в формат {code, message, fields}."""
    fields: dict[str, str] = {}
    top_message: str | None = None
    for err in exc.errors():
        loc = [p for p in err["loc"] if p != "body"]
        field = loc[-1] if loc and isinstance(loc[-1], str) else None
        msg = err["msg"]
        if msg.startswith("Value error, "):
            text = msg.removeprefix("Value error, ")      # наши русские сообщения из schemas.py
        elif (field, err["type"]) in BY_FIELD_AND_TYPE:
            text = BY_FIELD_AND_TYPE[(field, err["type"])]
        elif err["type"] in GENERIC:
            text = GENERIC[err["type"]]
        else:
            text = BY_FIELD.get(field, "Проверьте это поле")
        if field:
            fields.setdefault(field, text)
        elif top_message is None:
            top_message = text
    return JSONResponse(
        status_code=422,
        content={"detail": {
            "code": "VALIDATION",
            "message": top_message or "Проверьте введённые данные",
            "fields": fields,
        }},
    )


async def rate_limit_handler(request: Request, exc):
    """429 при слишком частых попытках входа."""
    return JSONResponse(
        status_code=429,
        content={"detail": {
            "code": "RATE_LIMITED",
            "message": "Слишком много попыток. Подождите немного.",
            "fields": {},
        }},
    )
