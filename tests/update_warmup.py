import re
from pathlib import Path

# 1. Update max_size in models.py
models_path = Path("scholarcli/storage/models.py")
models_text = models_path.read_text()
models_text = re.sub(
    r'def set_cached_embedding\(session: Session, query: str, vector: list\[float\], max_size: int = 1000\) -> None:',
    r'def set_cached_embedding(session: Session, query: str, vector: list[float], max_size: int = 5000) -> None:',
    models_text
)
models_path.write_text(models_text)

# 2. Add warmup function to rag_service.py
rag_path = Path("scholarcli/api/rag_service.py")
rag_text = rag_path.read_text()
warmup_code = """
import asyncio
from fastapi.concurrency import run_in_threadpool

async def warmup_embedding_cache():
    \"\"\"Pre-embeds the top 50 most frequent user queries.\"\"\"
    await run_in_threadpool(_do_warmup)

def _do_warmup():
    from sqlalchemy import func
    from scholarcli.storage import get_session
    from scholarcli.storage.models import ChatMessage, get_cached_embedding, set_cached_embedding
    import scholarcli.llm
    
    session = get_session()
    try:
        top_queries = (
            session.query(ChatMessage.content)
            .filter(ChatMessage.role == 'user')
            .group_by(ChatMessage.content)
            .order_by(func.count(ChatMessage.id).desc())
            .limit(50)
            .all()
        )
        
        if not top_queries:
            return
            
        emb = scholarcli.llm.get_embeddings()
        for (query,) in top_queries:
            if not query.strip():
                continue
                
            cached = get_cached_embedding(session, query)
            if cached is None:
                try:
                    vector = emb.embed_query(query)
                    set_cached_embedding(session, query, vector, max_size=5000)
                except Exception as e:
                    logger.warning(f"Failed to embed warmup query '{query}': {e}")
    except Exception as e:
        logger.warning(f"Embedding warmup failed: {e}")
    finally:
        session.close()
"""
rag_path.write_text(rag_text + warmup_code)

# 3. Update app.py lifespan
app_path = Path("scholarcli/api/app.py")
app_text = app_path.read_text()

lifespan_replacement = """    start_pool(get_settings().ingest.max_concurrent)
    
    import asyncio
    from scholarcli.api.rag_service import warmup_embedding_cache
    asyncio.create_task(warmup_embedding_cache())
    
    yield"""
app_text = app_text.replace("    start_pool(get_settings().ingest.max_concurrent)\n    yield", lifespan_replacement)
app_path.write_text(app_text)

