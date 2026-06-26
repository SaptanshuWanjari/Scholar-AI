"""Retrieval-trace analytics.

Records which chunks show up in *weak* generations (ungrounded or low
confidence) plus manual thumbs-down feedback, then aggregates per source so a
user can see which chunks consistently lead to poor answers. Logging is
best-effort and never raises into the request path.
"""

from __future__ import annotations

from collections import defaultdict

from scholarcli.storage import get_session
from scholarcli.storage.models import ChunkFeedback

# Generations at or below this confidence are treated as "weak" for logging.
WEAK_CONFIDENCE = 0.4


def log_weak_generation(
    query: str, retrieved: list[dict], grounded: bool, confidence: float | None
) -> None:
    """If a generation was ungrounded / low-confidence, record its chunks."""
    is_weak = (not grounded) or (confidence is not None and confidence <= WEAK_CONFIDENCE)
    if not is_weak or not retrieved:
        return
    session = get_session()
    try:
        for ch in retrieved:
            dist = ch.get("_distance")
            sim = round(max(0.0, min(1.0, 1.0 - dist)), 4) if dist is not None else 0.0
            session.add(
                ChunkFeedback(
                    query=(query or "")[:512],
                    chunk_id=str(ch.get("id", ""))[:128],
                    source=str(ch.get("title", "Untitled"))[:512],
                    similarity=sim,
                    verdict="weak",
                )
            )
        session.commit()
    except Exception:  # noqa: BLE001 — analytics logging is best-effort
        pass
    finally:
        session.close()


def record_feedback(chunk_id: str, source: str, query: str = "", similarity: float = 0.0) -> None:
    """Record a manual thumbs-down on a chunk."""
    session = get_session()
    try:
        session.add(
            ChunkFeedback(
                query=(query or "")[:512],
                chunk_id=(chunk_id or "")[:128],
                source=(source or "")[:512],
                similarity=float(similarity or 0.0),
                verdict="down",
            )
        )
        session.commit()
    finally:
        session.close()


def analytics(limit: int = 20) -> dict:
    """Aggregate feedback per source: how often each shows up in weak answers."""
    session = get_session()
    from sqlalchemy import func
    try:
        rows = session.query(
            func.coalesce(ChunkFeedback.source, "Untitled").label("source"),
            ChunkFeedback.verdict,
            func.count().label("count"),
            func.avg(ChunkFeedback.similarity).label("avg_sim")
        ).group_by(func.coalesce(ChunkFeedback.source, "Untitled"), ChunkFeedback.verdict).all()
        total_flags = sum(r.count for r in rows)
    finally:
        session.close()

    by_source: dict[str, dict] = defaultdict(
        lambda: {"weak": 0, "down": 0, "simSum": 0.0, "n": 0}
    )
    for r in rows:
        agg = by_source[r.source]
        agg["n"] += r.count
        agg["simSum"] += r.avg_sim * r.count
        if r.verdict == "down":
            agg["down"] += r.count
        else:
            agg["weak"] += r.count

    items = [
        {
            "source": src,
            "weakCount": a["weak"],
            "downCount": a["down"],
            "total": a["n"],
            "avgSimilarity": round(a["simSum"] / a["n"], 4) if a["n"] else 0.0,
        }
        for src, a in by_source.items()
    ]
    # Worst offenders first: most flags, then lowest similarity.
    items.sort(key=lambda x: (-(x["weakCount"] + x["downCount"]), x["avgSimilarity"]))
    return {
        "totalFlags": total_flags,
        "sources": items[:limit],
    }
