from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from database import get_db
from auth.dependencies import get_current_user
from documents.service import create_document
from documents.models import Document
from sessions.models import Session as ChatSession

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.get("/")
def list_user_documents(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    rows = (
        db.query(Document, ChatSession.title)
        .join(ChatSession, Document.session_id == ChatSession.id)
        .filter(Document.user_id == user.id)
        .order_by(Document.created_at.desc())
        .all()
    )

    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "session_id": doc.session_id,
            "session_title": session_title,
            "created_at": doc.created_at.isoformat() if doc.created_at else None,
        }
        for doc, session_title in rows
    ]


@router.post("/upload/{session_id}")
async def upload_document(
    session_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    content = await file.read()

    doc = create_document(
        db=db,
        file=content,
        filename=file.filename,
        session_id=session_id,
        user_id=user.id
    )

    return {
        "id": doc.id,
        "filename": doc.filename,
        "message": "Uploaded successfully"
    }


@router.get("/session/{session_id}")
def list_session_documents(
    session_id: int,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):

    docs = db.query(Document).filter(
        Document.session_id == session_id,
        Document.user_id == user.id
    ).all()

    return [
        {
            "id": d.id,
            "filename": d.filename,
            "created_at": d.created_at.isoformat() if d.created_at else None
        }
        for d in docs
    ]