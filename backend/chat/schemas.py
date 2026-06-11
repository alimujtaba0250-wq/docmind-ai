from datetime import datetime

from pydantic import BaseModel


class MessageOut(BaseModel):
    role: str
    content: str
    sources: list[str] | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True
