from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.dependencies import get_current_user
from auth.models import User
from database import get_db
from sessions.schemas import SessionCreate
from sessions.service import (
    create_session,
    get_user_sessions,
    get_session,
    delete_session
)

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/")
def create(
    data: SessionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    return create_session(db, data.title, user.id)

@router.get("/")
def list_sessions(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    return get_user_sessions(db, user.id)

@router.get("/{session_id}")
def detail(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    session = get_session(db, session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Not found")

    if session.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return session


@router.delete("/{session_id}")
def remove(
    session_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):

    session = get_session(db, session_id)

    if not session:
        raise HTTPException(status_code=404, detail="Not found")

    if session.user_id != user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    db.delete(session)
    db.commit()

    return {"message": "Deleted"}