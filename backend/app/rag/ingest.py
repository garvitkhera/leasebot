import uuid
from pathlib import Path
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
import litellm
from app.config import get_settings
from app.rag.store import get_collection


def get_embedding(text):
    s = get_settings()
    response = litellm.embedding(
        model="text-embedding-3-small",
        input=[text],
        api_key=s.llm_api_key,
    )
    return response.data[0]["embedding"]


def get_embeddings_batch(texts, batch_size=20):
    s = get_settings()
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = litellm.embedding(
            model="text-embedding-3-small",
            input=batch,
            api_key=s.llm_api_key,
        )
        all_embeddings.extend([d["embedding"] for d in response.data])
    return all_embeddings


def ingest_file(file_path, doc_id=None):
    doc_id = doc_id or str(uuid.uuid4())
    path = Path(file_path)

    reader = SimpleDirectoryReader(input_files=[str(path)])
    documents = reader.load_data()

    splitter = SentenceSplitter(chunk_size=512, chunk_overlap=50)
    nodes = splitter.get_nodes_from_documents(documents)

    texts = [node.get_content() for node in nodes]
    embeddings = get_embeddings_batch(texts)

    collection = get_collection()
    ids = [f"{doc_id}_{i}" for i in range(len(nodes))]
    metadatas = [
        {"doc_id": doc_id, "filename": path.name, "chunk_index": i, "source": path.name}
        for i in range(len(nodes))
    ]

    collection.add(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)

    return {"doc_id": doc_id, "filename": path.name, "chunk_count": len(nodes)}


def delete_doc_chunks(doc_id):
    collection = get_collection()
    results = collection.get(where={"doc_id": doc_id})
    if results["ids"]:
        collection.delete(ids=results["ids"])