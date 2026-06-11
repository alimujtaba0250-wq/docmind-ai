# DocMind AI

Chat with your documents using **local** retrieval and AI — upload PDFs or DOCX files, ask questions in natural language, and get answers grounded in your content. Everything runs on your machine: embeddings, vector search, and text generation via [Ollama](https://ollama.com).

![Stack](https://img.shields.io/badge/Next.js-16-black) ![FastAPI](https://img.shields.io/badge/FastAPI-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791) ![ChromaDB](https://img.shields.io/badge/ChromaDB-local-orange)

---

## Features

- **Document upload** — PDF and DOCX support with automatic text extraction and chunking
- **Semantic search** — ChromaDB + `sentence-transformers` (`all-MiniLM-L6-v2`) for relevant passage retrieval
- **Local LLM answers** — Ollama generates responses from retrieved context (no cloud API required)
- **Sessions** — Organize chats and documents per project or topic
- **Persistent chat history** — Messages saved per session in PostgreSQL
- **User accounts** — Register, login (JWT), change password, newsletter preference
- **Privacy-first** — Documents and embeddings stay on your infrastructure

---

## Architecture

```
┌─────────────────┐     /api-backend/*      ┌──────────────────┐
│  Next.js 16     │ ──────────────────────► │  FastAPI         │
│  (frontend)     │                         │  (backend)       │
└─────────────────┘                         └────────┬─────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    ▼                              ▼                              ▼
             ┌─────────────┐              ┌───────────────┐              ┌─────────────┐
             │ PostgreSQL  │              │ ChromaDB      │              │ Ollama      │
             │ users,      │              │ per-session   │              │ local LLM   │
             │ sessions,   │              │ embeddings    │              │             │
             │ messages    │              │               │              │             │
             └─────────────┘              └───────────────┘              └─────────────┘
```

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | FastAPI, SQLAlchemy, Uvicorn |
| Database | PostgreSQL |
| Vector store | ChromaDB (persistent, `backend/chroma_db/`) |
| Embeddings | sentence-transformers |
| LLM | Ollama (configurable model) |
| Auth | JWT (python-jose), bcrypt |

---

## Project structure

```
docmind-ai/
├── backend/
│   ├── auth/           # Users, login, password, newsletter
│   ├── chat/           # RAG chat + message persistence
│   ├── documents/      # Upload, extract, chunk
│   ├── sessions/       # Chat sessions CRUD
│   ├── vectorstore/    # Chroma + embeddings
│   ├── uploads/        # Stored uploaded files
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/            # Next.js App Router pages
│   ├── lib/            # API client, auth context
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+ (3.14 may work with your venv)
- **PostgreSQL** (or Docker)
- **Ollama** — [Install Ollama](https://ollama.com/download)

---

## Quick start

### 1. Database (Docker)

```bash
docker run -d --name rag_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=rag_db \
  -p 5435:5432 \
  postgres:16
```

Or start an existing container:

```bash
docker start rag_postgres
```

### 2. Ollama

```bash
# Install Ollama, then pull a model (lightweight example)
ollama pull qwen2.5:0.5b

# Ollama usually runs automatically; verify:
curl http://localhost:11434/api/tags
```

### 3. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5435/rag_db

SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:0.5b
```

Start the API:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=/api-backend
BACKEND_URL=http://127.0.0.1:8000
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Register** or **log in** at `/login`
2. Open **Dashboard** → create a new session (optionally upload a document)
3. Go to **Chat** → upload PDF/DOCX if needed → ask questions
4. View all uploads under **Documents**
5. Manage account, password, and newsletter under **Settings**

---

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| POST | `/auth/change-password` | Change password (auth required) |
| GET | `/auth/me` | User profile |
| PATCH | `/auth/newsletter` | Newsletter preference |
| GET/POST | `/sessions/` | List / create sessions |
| DELETE | `/sessions/{id}` | Delete session |
| POST | `/documents/upload/{session_id}` | Upload file |
| GET | `/documents/` | List all user documents |
| GET | `/documents/session/{session_id}` | Documents in session |
| POST | `/chat/message` | Ask a question (RAG + Ollama) |
| GET | `/chat/messages?session_id=` | Chat history |

Authenticated routes require header: `Authorization: Bearer <token>`

---

## Configuration

### Ollama models

Set `OLLAMA_MODEL` in `backend/.env`. Examples:

| Model | Size | Notes |
|-------|------|-------|
| `qwen2.5:0.5b` | ~400 MB | Fast, good for CPU |
| `llama3.2:1b` | ~1.3 GB | Balanced |
| `phi3:mini` | ~2 GB | Better quality |

```bash
ollama pull <model-name>
```

First response after upload may be slow on CPU while the model loads.

### Frontend API proxy

The frontend proxies API calls through `/api-backend` to avoid CORS issues when using LAN IPs (e.g. `http://192.168.x.x:3000`). The Next.js route handler forwards requests to `BACKEND_URL`.

---

## Development

```bash
# Backend with auto-reload
cd backend && source venv/bin/activate
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm run dev

# Production build (frontend)
cd frontend && npm run build && npm start
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot reach the API` | Ensure backend is on port 8000; restart frontend after `.env.local` changes |
| `Connection refused` (port 5435) | Start Postgres: `docker start rag_postgres` |
| `Address already in use` (8000) | Another uvicorn instance is running; stop it or use another port |
| Ollama errors / slow replies | Run `ollama pull <OLLAMA_MODEL>`; CPU inference can take 30s–2min |
| `Not authenticated` on dashboard | Log out and log in again; check JWT in localStorage |
| Empty chat when reopening session | Only messages sent after history feature was added are stored |

---

## Security notes

- Change `SECRET_KEY` before any production deployment
- Do not commit `.env` or `.env.local` files
- Uploaded files are stored in `backend/uploads/`
- Vector data is stored in `backend/chroma_db/`

---

## License

This project is provided as-is for educational and internal use. Add your license here if you open-source it.

---

## Acknowledgments

Built with [FastAPI](https://fastapi.tiangolo.com/), [Next.js](https://nextjs.org/), [ChromaDB](https://www.trychroma.com/), [Sentence Transformers](https://www.sbert.net/), and [Ollama](https://ollama.com/).
