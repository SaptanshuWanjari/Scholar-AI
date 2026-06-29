import re
from pathlib import Path

def patch_file(path_str):
    path = Path(path_str)
    text = path.read_text()
    if "from datetime import datetime" not in text:
        text = "from datetime import datetime\n" + text
        
    # for notebook:
    text = re.sub(
        r'(nb = session\.get\(Notebook, notebook_id\)\n\s+if not nb:\n\s+raise HTTPException.*?)\n(\s+return _full\(nb\))',
        r'\1\n        nb.last_opened_at = datetime.now()\n        session.commit()\n\2',
        text,
        flags=re.DOTALL
    )
    
    # for deck:
    text = re.sub(
        r'(deck = session\.get\(Deck, deck_id\)\n\s+if not deck:\n\s+raise HTTPException.*?)\n(\s+return _deck_out\(deck\))',
        r'\1\n        deck.last_opened_at = datetime.now()\n        session.commit()\n\2',
        text,
        flags=re.DOTALL
    )
    
    # for diagram:
    text = re.sub(
        r'(diag = session\.get\(Diagram, diagram_id\)\n\s+if not diag:\n\s+raise HTTPException.*?)\n(\s+return _diagram_out\(diag\))',
        r'\1\n        diag.last_opened_at = datetime.now()\n        session.commit()\n\2',
        text,
        flags=re.DOTALL
    )
    
    # for whiteboard:
    text = re.sub(
        r'(wb = session\.get\(Whiteboard, whiteboard_id\)\n\s+if not wb:\n\s+raise HTTPException.*?)\n(\s+return _full\(wb\))',
        r'\1\n        wb.last_opened_at = datetime.now()\n        session.commit()\n\2',
        text,
        flags=re.DOTALL
    )

    path.write_text(text)

patch_file("scholarcli/api/routers/notebooks.py")
patch_file("scholarcli/api/routers/library.py")
patch_file("scholarcli/api/routers/whiteboards.py")

