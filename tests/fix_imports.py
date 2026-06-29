from pathlib import Path

def fix(path):
    p = Path(path)
    text = p.read_text()
    if text.startswith("from datetime import datetime\n"):
        text = text[len("from datetime import datetime\n"):]
        # find where to insert it safely (after __future__)
        lines = text.split('\n')
        for i, line in enumerate(lines):
            if not line.startswith('from __future__') and not line.startswith('"""'):
                lines.insert(i, "from datetime import datetime")
                break
        p.write_text('\n'.join(lines))

fix("scholarcli/api/routers/notebooks.py")
fix("scholarcli/api/routers/whiteboards.py")
fix("scholarcli/api/routers/library.py")
