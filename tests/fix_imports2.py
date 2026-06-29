from pathlib import Path

def fix(path):
    p = Path(path)
    text = p.read_text()
    lines = text.split('\n')
    
    # Remove all "from datetime import datetime" lines
    lines = [l for l in lines if l != "from datetime import datetime"]
    
    # Find the right spot to insert it: after imports like "from __future__ import annotations"
    insert_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("from __future__"):
            insert_idx = i + 1
            break
        elif line.startswith('"""') and i > 0: # end of docstring
            insert_idx = i + 1
    
    lines.insert(insert_idx, "from datetime import datetime")
    p.write_text('\n'.join(lines))

fix("scholarcli/api/routers/notebooks.py")
fix("scholarcli/api/routers/whiteboards.py")
fix("scholarcli/api/routers/library.py")
