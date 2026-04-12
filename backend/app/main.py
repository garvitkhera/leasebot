from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api import chat, documents, conversations, analytics

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="AI-powered leasing assistant with RAG + tool calling",
    version="0.1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(conversations.router)
app.include_router(analytics.router)


@app.get("/")
async def root():
    return {"app": settings.app_name, "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
