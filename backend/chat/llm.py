import json
import urllib.error
import urllib.request

from config import OLLAMA_BASE_URL, OLLAMA_MODEL


def _build_prompt(question: str, chunks: list[str]) -> str:
    context = "\n\n".join(
        f"[Source {i + 1}]\n{chunk}" for i, chunk in enumerate(chunks)
    )

    return f"""You are DocMind AI, a helpful document assistant.

Answer the user's question using ONLY the document excerpts below.
- Follow the user's requested format (e.g. bullet points, short list, comparison).
- Give a direct, natural-language answer — do NOT dump raw excerpts.
- If the excerpts do not contain enough information, say what is missing.
- If the user greets you or asks something unrelated to the document, reply briefly and invite document-related questions.

Document excerpts:
{context}

User question: {question}
"""


def generate_answer(question: str, chunks: list[str]) -> str:
    prompt = _build_prompt(question, chunks)
    url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = json.dumps({
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 512,
        },
    }).encode()

    request = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            data = json.loads(response.read())
    except urllib.error.URLError as exc:
        raise ValueError(
            f"Cannot reach Ollama at {OLLAMA_BASE_URL}. "
            f"Install Ollama, pull a model, and start it:\n"
            f"  ollama pull {OLLAMA_MODEL}\n"
            f"  ollama serve"
        ) from exc

    text = (data.get("response") or "").strip()
    if not text:
        raise ValueError(
            f"Ollama returned an empty response. Is '{OLLAMA_MODEL}' installed? "
            f"Run: ollama pull {OLLAMA_MODEL}"
        )

    return text
