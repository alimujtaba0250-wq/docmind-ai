from pydantic import BaseModel


class SessionCreate(BaseModel):
    title: str


class SessionOut(BaseModel):
    id: int
    title: str
    user_id: int

    class Config:
        from_attributes = True