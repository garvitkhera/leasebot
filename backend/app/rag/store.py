import chromadb
from app.config import get_settings

_chroma_client = None


def get_chroma_client() -> chromadb.PersistentClient:
    global _chroma_client
    if _chroma_client is None:
        s = get_settings()
        _chroma_client = chromadb.PersistentClient(path=s.chroma_persist_dir)
    return _chroma_client


def get_collection():
    client = get_chroma_client()
    s = get_settings()
    return client.get_or_create_collection(
        name=s.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )
