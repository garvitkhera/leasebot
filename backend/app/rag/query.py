from app.rag.store import get_collection
from app.rag.ingest import get_embed_model


def query_documents(question: str, top_k: int = 5) -> list[dict]:
    """Query ChromaDB for relevant chunks.

    Returns list of {text, source, score}
    """
    embed_model = get_embed_model()
    query_embedding = embed_model.get_text_embedding(question)

    collection = get_collection()

    # check if collection has any docs
    if collection.count() == 0:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    for i in range(len(results["ids"][0])):
        chunks.append({
            "text": results["documents"][0][i],
            "source": results["metadatas"][0][i].get("filename", "unknown"),
            "score": 1 - results["distances"][0][i],  # cosine distance → similarity
        })

    return chunks


def build_context(chunks: list[dict], max_chars: int = 4000) -> str:
    """Build a context string from retrieved chunks."""
    if not chunks:
        return "No relevant documents found."

    context_parts = []
    total_chars = 0
    for chunk in chunks:
        if total_chars + len(chunk["text"]) > max_chars:
            break
        context_parts.append(
            f"[Source: {chunk['source']}]\n{chunk['text']}"
        )
        total_chars += len(chunk["text"])

    return "\n\n---\n\n".join(context_parts)
