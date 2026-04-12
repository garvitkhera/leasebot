# LeaseBot — AI Leasing Assistant

AI-powered leasing assistant for property managers. Uses RAG over lease documents + tool calling for real actions (unit search, booking viewings, maintenance requests).

## Tech Stack

- **Backend**: FastAPI + LiteLLM (model-agnostic) + LlamaIndex + ChromaDB
- **Frontend**: React + Vite + Tailwind + shadcn/ui
- **Database**: Supabase (Postgres)
- **Embeddings**: HuggingFace BGE (free, local)
- **LLM**: Gemini Flash / GPT-4o-mini / Claude Haiku (your choice)

## Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `backend/supabase_schema.sql`
3. Copy your project URL, anon key, and service role key

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Configure
cp .env.example .env
# Edit .env with your API keys

# Run
uvicorn app.main:app --reload --port 8000
```

### 3. Upload Sample Docs

```bash
# Upload lease agreement
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@data/sample_lease.md"

# Upload amenities guide
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@data/amenities.md"
```

### 4. Chat

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the pet policy?"}'
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message, get AI response |
| POST | `/api/documents/upload` | Upload doc for RAG |
| GET | `/api/documents/` | List uploaded docs |
| DELETE | `/api/documents/{id}` | Remove a document |
| GET | `/api/conversations/` | List all conversations |
| GET | `/api/conversations/{id}` | Get conversation detail |
| GET | `/api/analytics/` | Dashboard analytics |

## Architecture

```
User → Chat API → Agent Engine
                    ├── RAG (ChromaDB) → Answer from docs
                    ├── Tool Calls → check_availability, schedule_viewing, etc.
                    ├── Memory → Multi-turn context
                    └── Supabase → Persist conversations
```
