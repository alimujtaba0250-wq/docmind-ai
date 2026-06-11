import chromadb

from vectorstore.embeddings import get_embedding_model

client = chromadb.PersistentClient(
    path="chroma_db"
)


def get_collection(session_id: int):

    collection_name = f"session_{session_id}"

    return client.get_or_create_collection(
        name=collection_name
    )


def store_document_chunks(
    session_id: int,
    chunks: list[str]
):

    collection = get_collection(session_id)

    embeddings = get_embedding_model().encode(chunks)

    existing = collection.get()
    offset = len(existing["ids"])

    ids = [
        f"chunk_{offset + i}"
        for i in range(len(chunks))
    ]

    collection.add(
        documents=chunks,
        embeddings=embeddings.tolist(),
        ids=ids
    )


def search_similar_chunks(
    session_id: int,
    query: str,
    top_k: int = 5
) -> list[str]:

    collection = get_collection(session_id)

    query_embedding = get_embedding_model().encode(query).tolist()

    count = collection.count()
    if count == 0:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, count),
    )

    documents = results.get("documents") or []
    if not documents or not documents[0]:
        return []

    return documents[0]
