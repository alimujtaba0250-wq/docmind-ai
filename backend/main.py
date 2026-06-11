from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from sqlalchemy import inspect, text
from database import Base, engine
from auth.models import NewsletterSubscriber  # noqa: F401
from auth.router import router as auth_router
from sessions.router import router as sessions_router
from documents.router import router as documents_router
from chat.models import Message  # noqa: F401 — register table with SQLAlchemy
from chat.router import router as chat_router

Base.metadata.create_all(bind=engine)


def _ensure_schema():
    inspector = inspect(engine)
    if "users" in inspector.get_table_names():
        user_cols = {c["name"] for c in inspector.get_columns("users")}
        if "newsletter_subscribed" not in user_cols:
            with engine.connect() as conn:
                conn.execute(
                    text(
                        "ALTER TABLE users ADD COLUMN newsletter_subscribed "
                        "BOOLEAN NOT NULL DEFAULT FALSE"
                    )
                )
                conn.commit()


_ensure_schema()

app = FastAPI(
    title="DocMind AI",
    description="Chat with your documents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"http://192\.168\.\d+\.\d+:(3000|3001)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(sessions_router)
app.include_router(documents_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "DocMind API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/db-test")
def db_test():

    with engine.connect() as connection:

        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar()
        }