from sqlalchemy.orm import Session

from chat.models import Message
from sessions.service import get_session


def save_message(
    db: Session,
    session_id: int,
    role: str,
    content: str,
    sources: list[str] | None = None,
) -> Message:
    msg = Message(
        session_id=session_id,
        role=role,
        content=content,
        sources=sources,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


def get_session_messages(db: Session, session_id: int, user_id: int) -> list[Message]:
    session = get_session(db, session_id)
    if not session or session.user_id != user_id:
        return []

    return (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at.asc(), Message.id.asc())
        .all()
    )
