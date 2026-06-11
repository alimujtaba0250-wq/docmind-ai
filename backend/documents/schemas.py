from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: int
    filename: str
    session_id: int

    class Config:
        from_attributes = True