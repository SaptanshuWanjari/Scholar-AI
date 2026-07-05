"""FastAPI application factory.

Run with: ``scholar serve`` (or ``uvicorn scholarai.api.app:app --reload``).
"""

from __future__ import annotations

from pathlib import Path

from contextlib import asynccontextmanager

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger(__name__)

from scholarai.storage import init_db, get_session
from scholarai.api.plugin_catalog import PLUGIN_CATALOG
from scholarai.storage.models import PluginState


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    from scholarai.api.prompt_service import seed_prompts
    seed_prompts()

    # Seed plugin states for any new plugins
    session = get_session()
    try:
        for entry in PLUGIN_CATALOG:
            existing = session.get(PluginState, entry["id"])
            if existing is None:
                session.add(PluginState(
                    plugin_id=entry["id"],
                    installed=entry["default_installed"],
                    enabled=entry["default_installed"],
                ))
        session.commit()
    finally:
        session.close()
    from scholarai.api.worker_pool import start_pool, stop_pool
    from scholarai.config import get_settings
    start_pool(get_settings().ingest.max_concurrent)
    
    import asyncio
    from scholarai.api.rag_service import warmup_embedding_cache
    asyncio.create_task(warmup_embedding_cache())
    from scholarai.services.backup_service import start_backup_scheduler
    asyncio.create_task(start_backup_scheduler())

    yield
    stop_pool()


def create_app() -> FastAPI:
    app = FastAPI(
        title="ScholarAI API",
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

    from scholarai.api.routers import (
        ask,
        backup,
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
        plugin_manager,
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
        trash,
        whiteboards,
    )
    from scholarai.api import notebook_service
    from scholarai.config import get_settings

    _core_modules = (
        ask,
        backup,
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
        plugin_manager,
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
        trash,
        whiteboards,
        notebook_service,
    )
    for module in _core_modules:
        app.include_router(module.router)

    if get_settings().features.cloud_providers_enabled:
        from scholarai.api.routers import providers, routing, usage
        for module in (providers, routing, usage):
            app.include_router(module.router)

    @app.exception_handler(Exception)
    async def unhandled_error_handler(request: Request, exc: Exception):
        logger.warning("Unhandled exception at %s: %s", request.url.path, exc)
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
        )

    @app.get("/api/health", tags=["health"])
    async def health() -> dict:
        import httpx
        from scholarai.config import get_settings
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

        embed_model = settings.models.embedding
        embed_available = any(m == embed_model or m.startswith(embed_model + ":") for m in models)

        return {
            "status": "ok",
            "ollama_reachable": ollama_reachable,
            "embed_available": embed_available,
            "embed_model": embed_model,
        }

    frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

    return app


app = create_app()
