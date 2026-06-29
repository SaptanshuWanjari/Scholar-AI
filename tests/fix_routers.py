import os
import re
from pathlib import Path

routers_dir = Path("scholarcli/api/routers")

def fix_sort(text, model_name, old_col, new_col="last_opened_at"):
    # replace Notebook.updated_at.desc() with Notebook.last_opened_at.desc()
    return text.replace(f"{model_name}.{old_col}.desc()", f"{model_name}.{new_col}.desc()")

for file in routers_dir.glob("*.py"):
    text = file.read_text()
    
    text = fix_sort(text, "Notebook", "updated_at")
    text = fix_sort(text, "Whiteboard", "updated_at")
    text = fix_sort(text, "Deck", "created_at")
    text = fix_sort(text, "Diagram", "created_at")

    file.write_text(text)

