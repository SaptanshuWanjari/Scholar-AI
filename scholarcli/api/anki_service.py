"""Anki .apkg import/export.

Export builds a real Anki package via ``genanki``. Import reads a .apkg (a zip
whose ``collection.anki2`` is a SQLite DB) directly with stdlib sqlite3 — no
extra dependency — pulling each note's first two fields as front/back.
"""

from __future__ import annotations

import re
import sqlite3
import tempfile
import zipfile
from pathlib import Path

from scholarcli.storage import get_session
from scholarcli.storage.models import Card, Deck

# Stable IDs so re-exporting the same deck stays consistent in Anki.
_MODEL_ID = 1607392319
_MODEL_NAME = "ScholarCLI Basic"


def export_deck(deck_id: int) -> tuple[str, bytes]:
    """Build a .apkg for a deck. Returns (filename, bytes). Raises if missing."""
    import genanki  # imported lazily so the dep is only needed for export

    session = get_session()
    try:
        deck = session.get(Deck, deck_id)
        if not deck:
            raise ValueError("Deck not found")
        cards = list(deck.cards)
        name = deck.name
    finally:
        session.close()

    model = genanki.Model(
        _MODEL_ID,
        _MODEL_NAME,
        fields=[{"name": "Front"}, {"name": "Back"}],
        templates=[
            {
                "name": "Card 1",
                "qfmt": "{{Front}}",
                "afmt": '{{FrontSide}}<hr id="answer">{{Back}}',
            }
        ],
    )
    # Deterministic deck id from the name keeps re-imports merging cleanly.
    deck_id_anki = 2_000_000_000 + (abs(hash(name)) % 1_000_000_000)
    anki_deck = genanki.Deck(deck_id_anki, name)
    for c in cards:
        anki_deck.add_note(genanki.Note(model=model, fields=[c.front or "", c.back or ""]))

    out = tempfile.NamedTemporaryFile(suffix=".apkg", delete=False)
    out.close()
    genanki.Package(anki_deck).write_to_file(out.name)
    data = Path(out.name).read_bytes()
    Path(out.name).unlink(missing_ok=True)
    safe = re.sub(r"[^\w.-]+", "_", name) or "deck"
    return f"{safe}.apkg", data


_HTML_TAG = re.compile(r"<[^>]+>")
_FIELD_SEP = "\x1f"  # Anki separates a note's fields with this character.


def _strip_html(text: str) -> str:
    return _HTML_TAG.sub(" ", text or "").replace("&nbsp;", " ").strip()


def import_apkg(data: bytes, course: str | None = None, deck_name: str | None = None) -> dict:
    """Read a .apkg's notes and persist them as a new Deck + Cards.

    Returns {deckId, name, cards}. Raises ValueError on an unreadable package.
    """
    with tempfile.TemporaryDirectory() as tmp:
        apkg_path = Path(tmp) / "in.apkg"
        apkg_path.write_bytes(data)
        try:
            with zipfile.ZipFile(apkg_path) as zf:
                member = "collection.anki2"
                names = zf.namelist()
                if member not in names:
                    # Newer exports may ship collection.anki21.
                    member = next((n for n in names if n.startswith("collection.anki2")), "")
                if not member:
                    raise ValueError("Not a valid .apkg (no collection database)")
                db_path = Path(tmp) / "collection.anki2"
                db_path.write_bytes(zf.read(member))
        except zipfile.BadZipFile as exc:
            raise ValueError("Not a valid .apkg archive") from exc

        con = sqlite3.connect(str(db_path))
        try:
            rows = con.execute("SELECT flds FROM notes").fetchall()
        finally:
            con.close()

    pairs: list[tuple[str, str]] = []
    for (flds,) in rows:
        parts = (flds or "").split(_FIELD_SEP)
        front = _strip_html(parts[0]) if parts else ""
        back = _strip_html(parts[1]) if len(parts) > 1 else ""
        if front or back:
            pairs.append((front, back))

    if not pairs:
        raise ValueError("No cards found in the package")

    session = get_session()
    try:
        deck = Deck(name=deck_name or "Imported deck", course=course or "")
        for front, back in pairs:
            deck.cards.append(
                Card(type="basic", front=front, back=back, due="Today", ease="new")
            )
        session.add(deck)
        session.commit()
        session.refresh(deck)
        return {"deckId": str(deck.id), "name": deck.name, "cards": len(pairs)}
    finally:
        session.close()
