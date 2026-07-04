"""Static catalog of provider capabilities for routing decisions.

This module intentionally has no DB imports — it is pure data used by
``RoutingEngine`` before any providers are instantiated.
"""

from __future__ import annotations

from scholarai.llm.providers.base import ProviderCapability

# Maps provider_id → set of capabilities it supports
PROVIDER_CAPABILITIES: dict[str, list[ProviderCapability]] = {
    "ollama": [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.EMBEDDINGS,
        ProviderCapability.TOOL_CALLING,
    ],
    "gemini": [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.VISION,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
        ProviderCapability.REASONING,
        ProviderCapability.EMBEDDINGS,
    ],
    "groq": [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
    ],
    "openrouter": [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.VISION,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
        ProviderCapability.EMBEDDINGS,
    ],
    "openai_compat": [
        ProviderCapability.CHAT,
        ProviderCapability.STREAMING,
        ProviderCapability.JSON_MODE,
        ProviderCapability.TOOL_CALLING,
    ],
}

# Tasks that must always go to the embeddings provider (Ollama)
EMBEDDING_TASKS: frozenset[str] = frozenset()

# Tasks that prefer a vision-capable model if available
VISION_TASKS: frozenset[str] = frozenset({"ocr", "image_qa"})

# Tasks that benefit from reasoning models
REASONING_TASKS: frozenset[str] = frozenset({"deep_analysis", "learning_path", "differences"})

# Default capability required per task (used in auto mode)
TASK_CAPABILITY_REQUIREMENTS: dict[str, ProviderCapability] = {
    "quick_qa": ProviderCapability.CHAT,
    "flashcards": ProviderCapability.CHAT,
    "quiz": ProviderCapability.CHAT,
    "mermaid": ProviderCapability.CHAT,
    "mindmap": ProviderCapability.CHAT,
    "study_notes": ProviderCapability.CHAT,
    "deep_analysis": ProviderCapability.REASONING,
    "differences": ProviderCapability.CHAT,
    "learning_path": ProviderCapability.CHAT,
    "data_qa": ProviderCapability.JSON_MODE,
    "plantuml": ProviderCapability.CHAT,
}
