from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database import get_db

from auth.schemas import UserRegister
from auth.schemas import UserLogin
from auth.schemas import ChangePassword
from auth.schemas import NewsletterUpdate
from auth.schemas import NewsletterSubscribe
from auth.schemas import UserProfile

from auth.service import create_user
from auth.service import authenticate_user
from auth.service import create_access_token
from auth.service import change_password
from auth.dependencies import get_current_user
from auth.models import User
from auth.models import NewsletterSubscriber

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = db.query(
        User
    ).filter_by(
        email=user.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = create_user(
        db,
        user.email,
        user.password
    )

    return {
        "message": "User created",
        "email": new_user.email
    }


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    authenticated_user = authenticate_user(
        db,
        user.email,
        user.password
    )

    if not authenticated_user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": authenticated_user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/change-password")
def update_password(
    body: ChangePassword,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        change_password(db, user, body.current_password, body.new_password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"message": "Password updated successfully"}


@router.get("/me", response_model=UserProfile)
def get_profile(user: User = Depends(get_current_user)):
    return UserProfile(
        email=user.email,
        newsletter_subscribed=bool(user.newsletter_subscribed),
    )


@router.patch("/newsletter", response_model=UserProfile)
def update_newsletter(
    body: NewsletterUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user.newsletter_subscribed = body.subscribed
    db.commit()
    db.refresh(user)
    return UserProfile(
        email=user.email,
        newsletter_subscribed=bool(user.newsletter_subscribed),
    )


@router.post("/newsletter/subscribe")
def public_newsletter_subscribe(
    body: NewsletterSubscribe,
    db: Session = Depends(get_db),
):
    account = db.query(User).filter(User.email == body.email).first()
    if account:
        account.newsletter_subscribed = True
        db.commit()
        return {"message": "You are subscribed to the newsletter."}

    existing = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.email == body.email)
        .first()
    )
    if existing:
        return {"message": "You are already subscribed."}

    db.add(NewsletterSubscriber(email=body.email))
    db.commit()
    return {"message": "Thanks for subscribing!"}