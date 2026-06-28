"""FastAPI application factory.

Run with: ``scholar serve`` (or ``uvicorn scholarcli.api.app:app --reload``).
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scholarcli.storage import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    from scholarcli.api.prompt_service import seed_prompts
    seed_prompts()
    from scholarcli.api.worker_pool import start_pool, stop_pool
    from scholarcli.config import get_settings
    start_pool(get_settings().ingest.max_concurrent)
    
    import asyncio
    from scholarcli.api.rag_service import warmup_embedding_cache
    asyncio.create_task(warmup_embedding_cache())
    
    yield
    stop_pool()


def create_app() -> FastAPI:
    app = FastAPI(
        title="ScholarCLI API",
        version="0.1.0",
        description="HTTP API over the local-first RAG study assistant.",
        lifespan=lifespan,
    )

    # Vite dev server origins. Adjust/extend for deployment.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    from scholarcli.api.routers import (
        ask,
        consistency,
        courses,
        dashboard,
        dependency,
        differences,
        documents,
        exam,
        jobs,
        knowledge,
        learning_path,
        library,
        notebooks,
        onboarding,
        plugins,
        prompt_enhancer,
        prompts,
        pyq,
        reading,
        search,
        settings,
        study,
        teach,
        trace,
        whiteboards,
    )
    from scholarcli.api import notebook_service

    for module in (
        ask,
        consistency,
        courses,
        dashboard,
        dependency,
        differences,
        documents,
        exam,
        jobs,
        knowledge,
        learning_path,
        library,
        notebooks,
        onboarding,
        plugins,
        prompt_enhancer,
        prompts,
        pyq,
        reading,
        search,
        settings,
        study,
        teach,
        trace,
        whiteboards,
        notebook_service,
    ):
        app.include_router(module.router)

    @app.get("/api/health", tags=["health"])
    async def health() -> dict:
        import httpx
        from scholarcli.config import get_settings
        settings = get_settings()
        
        # Check Ollama reachability
        ollama_reachable = False
        models = []
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                resp = await client.get("http://localhost:11434/api/tags")
                if resp.status_code == 200:
                    ollama_reachable = True
                    data = resp.json()
                    models = [m.get("name") for m in data.get("models", [])]
        except Exception:
            pass

        embed_model = settings.llm.embedding_model
        embed_available = any(m == embed_model or m.startswith(embed_model + ":") for m in models)

        return {
            "status": "ok",
            "ollama_reachable": ollama_reachable,
            "embed_available": embed_available,
            "embed_model": embed_model,
        }

    return app


app = create_app()
