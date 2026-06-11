from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from chat.llm import generate_answer
from chat.schemas import MessageOut
from chat.service import get_session_messages, save_message
from database import get_db
from sessions.service import get_session
from vectorstore.chroma import search_similar_chunks

router = APIRouter(prefix="/chat", tags=["Chat"])


class MessageRequest(BaseModel):
    session_id: int
    message: str


@router.get("/search")
def search(
    session_id: int,
    query: str,
    user=Depends(get_current_user)
):

    results = search_similar_chunks(
        session_id=session_id,
        query=query
    )

    return {
        "session_id": session_id,
        "query": query,
        "results": results
    }


@router.get("/messages", response_model=list[MessageOut])
def list_messages(
    session_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    session = get_session(db, session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Session not found")

    return get_session_messages(db, session_id, user.id)


@router.post("/message")
def send_message(
    body: MessageRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):

    session = get_session(db, body.session_id)
    if not session or session.user_id != user.id:
        raise HTTPException(status_code=404, detail="Session not found")

    save_message(db, body.session_id, "user", body.message)

    chunks = search_similar_chunks(
        session_id=body.session_id,
        query=body.message,
        top_k=5
    )

    if not chunks:
        reply = (
            "I couldn't find relevant information in the uploaded documents for your question. "
            "Please make sure you have uploaded documents to this session."
        )
    else:
        try:
            reply = generate_answer(body.message, chunks)
        except ValueError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail="Failed to generate an answer. Check that Ollama is running and the model is pulled.",
            ) from exc

    save_message(db, body.session_id, "ai", reply, chunks if chunks else None)

    return {
        "session_id": body.session_id,
        "question": body.message,
        "answer": reply,
        "sources": chunks
    }
