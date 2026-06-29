from pathlib import Path
import re

text = Path("scholarcli/api/routers/library.py").read_text()
# We want to find list_flashcards and add:
# if deck:
#     d = session.query(Deck).filter(Deck.name == deck).first()
#     if d:
#         d.last_opened_at = datetime.now()
#         session.commit()

new_text = re.sub(
    r'(def list_flashcards\(deck: str \| None = None, course: str \| None = None\) -> list\[FlashcardOut\]:\n\s+session = get_session\(\)\n\s+try:\n)',
    r'\1        if deck:\n            d = session.query(Deck).filter(Deck.name == deck).first()\n            if d:\n                d.last_opened_at = datetime.now()\n                session.commit()\n',
    text
)
Path("scholarcli/api/routers/library.py").write_text(new_text)
