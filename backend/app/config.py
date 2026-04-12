from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List


class Settings(BaseSettings):
    # LLM
    llm_model: str = "gemini/gemini-2.0-flash"
    llm_api_key: str = ""  # set GEMINI_API_KEY in .env

    # Supabase
    supabase_url: str = ""
    supabase_key: str = ""
    supabase_service_key: str = ""

    # ChromaDB
    chroma_persist_dir: str = "./chroma_db"
    chroma_collection: str = "lease_docs"

    # Embeddings (free local model)
    # embedding_model: str = "BAAI/bge-small-en-v1.5"

    # App
    app_name: str = "LeaseBot"
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
