from pydantic import BaseModel
from pydantic import EmailStr


class UserRegister(BaseModel):

    email: EmailStr

    password: str


class UserLogin(BaseModel):

    email: EmailStr

    password: str


class Token(BaseModel):

    access_token: str

    token_type: str


class ChangePassword(BaseModel):
    current_password: str
    new_password: str


class NewsletterUpdate(BaseModel):
    subscribed: bool


class NewsletterSubscribe(BaseModel):
    email: EmailStr


class UserProfile(BaseModel):
    email: EmailStr
    newsletter_subscribed: bool