import uuid
from pathlib import Path
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from app.config import get_settings
from app.rag.store import get_collection
from typing import Optional

_embed_model = None


def get_embed_model() -> HuggingFaceEmbedding:
    global _embed_model
    if _embed_model is None:
        s = get_settings()
        _embed_model = HuggingFaceEmbedding(model_name=s.embedding_model)
    return _embed_model

def ingest_file(file_path: str, doc_id: Optional[str] = None) -> dict:

    """Ingest a single file: read → chunk → embed → store in ChromaDB.

    Returns: {doc_id, filename, chunk_count}
    """
    doc_id = doc_id or str(uuid.uuid4())
    path = Path(file_path)

    # 1. Read file
    reader = SimpleDirectoryReader(input_files=[str(path)])
    documents = reader.load_data()

    # 2. Chunk
    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = splitter.get_nodes_from_documents(documents)

    # 3. Embed
    embed_model = get_embed_model()
    texts = [node.get_content() for node in nodes]
    embeddings = [embed_model.get_text_embedding(t) for t in texts]

    # 4. Store in ChromaDB
    collection = get_collection()
    ids = [f"{doc_id}_{i}" for i in range(len(nodes))]
    metadatas = [
        {
            "doc_id": doc_id,
            "filename": path.name,
            "chunk_index": i,
            "source": path.name,
        }
        for i in range(len(nodes))
    ]

    collection.add(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return {
        "doc_id": doc_id,
        "filename": path.name,
        "chunk_count": len(nodes),
    }


def delete_doc_chunks(doc_id: str):
    """Remove all chunks for a document from ChromaDB."""
    collection = get_collection()
    # get all IDs with this doc_id
    results = collection.get(where={"doc_id": doc_id})
    if results["ids"]:
        collection.delete(ids=results["ids"])
