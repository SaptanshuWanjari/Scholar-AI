"""RAG pipeline — single entry point ``build_rag()`` returns a compiled
LangGraph ``Runnable`` that threads:

    router → retrieve → verify → generate

Invoke it with: ``rag.invoke({"query": "...", "course": "..."})``
"""

from scholarcli.rag.graph import get_rag_app

build_rag = get_rag_app
