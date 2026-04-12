from app.rag.store import get_collection
from app.rag.ingest import get_embedding


def query_documents(question, top_k=5):
    query_embedding = get_embedding(question)

    collection = get_collection()

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
            "score": 1 - results["distances"][0][i],
        })

    return chunks


def build_context(chunks, max_chars=4000):
    if not chunks:
        return "No relevant documents found."

    context_parts = []
    total_chars = 0
    for chunk in chunks:
        if total_chars + len(chunk["text"]) > max_chars:
            break
        context_parts.append(f"[Source: {chunk['source']}]\n{chunk['text']}")
        total_chars += len(chunk["text"])

    return "\n\n---\n\n".join(context_parts)