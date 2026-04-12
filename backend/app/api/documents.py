import os
import uuid
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.rag.ingest import ingest_file, delete_doc_chunks
from app.models.database import save_document_meta, get_documents, delete_document_meta
from app.models.schemas import DocumentOut

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentOut)
async def upload_document(file: UploadFile = File(...)):
    """Upload a document (PDF, TXT, MD) for RAG ingestion."""
    allowed = {".pdf", ".txt", ".md", ".docx"}
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported file type: {ext}. Allowed: {allowed}")

    doc_id = str(uuid.uuid4())

    # Save to temp file for processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = ingest_file(tmp_path, doc_id=doc_id)
        # Save metadata to Supabase
        try:
            save_document_meta(doc_id, file.filename or "unknown", result["chunk_count"])
        except Exception:
            pass  # still works without DB

        return DocumentOut(
            id=doc_id,
            filename=file.filename or "unknown",
            uploaded_at="just now",
            chunk_count=result["chunk_count"],
        )
    finally:
        os.unlink(tmp_path)


@router.get("/", response_model=list[DocumentOut])
async def list_documents():
    try:
        docs = get_documents()
        return [
            DocumentOut(
                id=d["id"],
                filename=d["filename"],
                uploaded_at=d["uploaded_at"],
                chunk_count=d["chunk_count"],
            )
            for d in docs
        ]
    except Exception:
        return []


@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    delete_doc_chunks(doc_id)
    try:
        delete_document_meta(doc_id)
    except Exception:
        pass
    return {"status": "deleted", "doc_id": doc_id}
