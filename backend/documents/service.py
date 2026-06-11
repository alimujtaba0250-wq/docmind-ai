import os
from sqlalchemy.orm import Session

from documents.models import Document
from documents.processor import extract_text
from documents.chunker import split_text
from vectorstore.chroma import store_document_chunks


UPLOAD_DIR = "uploads"


def save_file(file, filename):

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file)

    return file_path


def create_document(
    db: Session,
    file,
    filename: str,
    session_id: int,
    user_id: int
):

    file_path = save_file(file, filename)

    content = extract_text(file_path)

    chunks = split_text(content)
    store_document_chunks(
        session_id=session_id,
        chunks=chunks
    )

    doc = Document(
        filename=filename,
        file_path=file_path,
        content=content,
        session_id=session_id,
        user_id=user_id
    )

    db.add(doc)
    db.commit()
    db.refresh(doc)

    return doc

