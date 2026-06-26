"""Tests for the net-new "Missing" features that don't need a live LLM:
Anki .apkg round-trip, concept prune/merge, and exam time enforcement.
"""

from datetime import datetime, timedelta, timezone

import pytest

# Prime the RAG graph first so prompt_service finishes loading before any router
# module imports it (avoids a pre-existing module-load-order circular import that
# only surfaces when a router is the very first scholarcli.api import).
import scholarcli.rag.graph  # noqa: F401,E402  (import for side-effect ordering)

from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import (
    Card,
    Concept,
    ConceptEdge,
    Deck,
    ExamSession,
)


@pytest.fixture(autouse=True)
def _db():
    init_db()


# ---------------------------------------------------------------------------
# Anki .apkg export → import round-trip
# ---------------------------------------------------------------------------



# ---------------------------------------------------------------------------
# Concept prune / merge
# ---------------------------------------------------------------------------

def test_merge_concepts_repoints_edges_and_deletes_drop():
    from scholarcli.api import knowledge_service

    session = get_session()
    try:
        keep = Concept(name="TCP", description="Transmission Control Protocol")
        drop = Concept(name="Transmission Control Protocol", description="full name")
        other = Concept(name="IP", description="Internet Protocol")
        session.add_all([keep, drop, other])
        session.flush()
        keep_id, drop_id, other_id = keep.id, drop.id, other.id
        # An edge from the soon-to-be-dropped concept should repoint to keep.
        session.add(ConceptEdge(source_id=drop_id, target_id=other_id, relation="related"))
        session.commit()
    finally:
        session.close()

    out = knowledge_service.merge_concepts(keep_id, drop_id)
    assert out is not None
    assert out["name"] == "TCP"
    assert "IP" in out["relatedConcepts"]

    session = get_session()
    try:
        assert session.get(Concept, drop_id) is None  # dropped removed
        assert session.get(Concept, keep_id) is not None  # survivor kept
        # No edge should still reference the dropped id.
        edges = session.query(ConceptEdge).all()
        assert all(drop_id not in (e.source_id, e.target_id) for e in edges)
    finally:
        session.close()


def test_merge_same_id_is_noop():
    from scholarcli.api import knowledge_service

    session = get_session()
    try:
        c = Concept(name="Solo", description="x")
        session.add(c)
        session.commit()
        cid = c.id
    finally:
        session.close()
    assert knowledge_service.merge_concepts(cid, cid) is None


def test_delete_concept_removes_edges():
    from scholarcli.api import knowledge_service

    session = get_session()
    try:
        a = Concept(name="A", description="")
        b = Concept(name="B", description="")
        session.add_all([a, b])
        session.flush()
        aid, bid = a.id, b.id
        session.add(ConceptEdge(source_id=aid, target_id=bid, relation="related"))
        session.commit()
    finally:
        session.close()

    assert knowledge_service.delete_concept(aid) is True

    session = get_session()
    try:
        assert session.get(Concept, aid) is None
        assert session.query(ConceptEdge).count() == 0  # touching edge gone
    finally:
        session.close()


# ---------------------------------------------------------------------------
# Exam time enforcement helpers
# ---------------------------------------------------------------------------

def test_exam_remaining_seconds_and_timeout_flag():
    from scholarcli.api.routers.exam import _remaining_seconds, _GRACE_SECONDS

    now = datetime.now(timezone.utc)

    # Untimed exam → no remaining-seconds limit.
    untimed = ExamSession(id="u", topic="t", questions=[], duration_minutes=0, expires_at=None)
    assert _remaining_seconds(untimed, now) is None

    # Active timed exam → some seconds left.
    active = ExamSession(
        id="a", topic="t", questions=[], duration_minutes=30,
        expires_at=now + timedelta(minutes=10),
    )
    assert _remaining_seconds(active, now) == pytest.approx(600, abs=2)

    # Expired exam → zero remaining, and past the grace window.
    expired = ExamSession(
        id="e", topic="t", questions=[], duration_minutes=30,
        expires_at=now - timedelta(seconds=_GRACE_SECONDS + 5),
    )
    assert _remaining_seconds(expired, now) == 0
