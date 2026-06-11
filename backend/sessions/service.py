from sqlalchemy.orm import Session
from sessions.models import Session as ChatSession


def create_session(db: Session, title: str, user_id: int):

    session = ChatSession(
        title=title,
        user_id=user_id
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session

def get_user_sessions(db: Session, user_id: int):

    return db.query(ChatSession).filter(
        ChatSession.user_id == user_id
    ).all()

def get_session(db: Session, session_id: int):

    return db.query(ChatSession).filter(
        ChatSession.id == session_id
    ).first()

def delete_session(db: Session, session_id: int):

    session = db.query(ChatSession).filter(
        ChatSession.id == session_id
    ).first()

    if session:
        db.delete(session)
        db.commit()

    return session