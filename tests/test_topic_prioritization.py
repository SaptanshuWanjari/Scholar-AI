"""Test that weak TopicStat accuracy triggers card prioritization."""

from datetime import date, timezone

import pytest

from scholarai.api.pyq_service import prioritize_weak_topic_cards, record_topic_results
from scholarai.storage import get_session, init_db
from scholarai.storage.models import Card, Deck, DepConcept, TopicStat


@pytest.fixture(autouse=True)
def _db():
    init_db()
    yield
    s = get_session()
    try:
        for t in (TopicStat, Card, Deck, DepConcept):
            s.query(t).delete()
        s.commit()
    finally:
        s.close()


def _concept(name: str, course: str) -> DepConcept:
    s = get_session()
    try:
        c = DepConcept(name=name, course=course, definition="", difficulty="Medium", importance=0.5, est_study_time_min=10, depth=1)
        s.add(c)
        s.commit()
        s.refresh(c)
        return c
    finally:
        s.close()


def _deck(name: str, course: str, concept_id: int) -> Deck:
    s = get_session()
    try:
        d = Deck(name=name, course=course, concept_id=concept_id)
        s.add(d)
        s.commit()
        s.refresh(d)
        return d
    finally:
        s.close()


def _card(deck_id: int, due: str = "2099-01-01") -> Card:
    s = get_session()
    try:
        c = Card(deck_id=deck_id, front="Q", back="A", due=due)
        s.add(c)
        s.commit()
        c_id = c.id
        return c_id
    finally:
        s.close()


def _card_due(card_id: int) -> str:
    s = get_session()
    try:
        return s.get(Card, card_id).due
    finally:
        s.close()


class TestPrioritizeWeakTopicCards:
    def test_weak_topic_resets_card_due(self):
        c = _concept("scheduling", "os")
        d = _deck("scheduling deck", "os", c.id)
        card_id = _card(d.id, due="2099-01-01")

        s = get_session()
        try:
            s.add(TopicStat(course="os", topic="scheduling", concept_id=c.id, correct=1, total=10))
            s.commit()
        finally:
            s.close()

        prioritize_weak_topic_cards("os")

        assert _card_due(card_id) == date.today().isoformat()

    def test_strong_topic_does_not_reset_card(self):
        c = _concept("memory", "os")
        d = _deck("mem deck", "os", c.id)
        card_id = _card(d.id, due="2099-01-01")

        s = get_session()
        try:
            s.add(TopicStat(course="os", topic="memory", concept_id=c.id, correct=8, total=10))
            s.commit()
        finally:
            s.close()

        prioritize_weak_topic_cards("os")

        assert _card_due(card_id) == "2099-01-01"

    def test_no_topicstat_does_nothing(self):
        c = _concept("io", "os")
        d = _deck("io deck", "os", c.id)
        card_id = _card(d.id, due="2099-01-01")

        prioritize_weak_topic_cards("os")

        assert _card_due(card_id) == "2099-01-01"

    def test_record_then_prioritize_integration(self):
        c = _concept("deadlocks", "os")
        d = _deck("dl deck", "os", c.id)
        card_id = _card(d.id, due="2099-01-01")

        s = get_session()
        try:
            s.add(TopicStat(course="os", topic="deadlocks", concept_id=c.id, correct=0, total=0))
            s.commit()
        finally:
            s.close()

        record_topic_results("os", {"deadlocks": [0, 5]})
        prioritize_weak_topic_cards("os")

        assert _card_due(card_id) == date.today().isoformat()
