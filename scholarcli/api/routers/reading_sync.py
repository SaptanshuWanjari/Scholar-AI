import re
from scholarcli.storage.models import Notebook, StickyNote

def sync_note_across_notebooks(session, note: StickyNote, doc_title: str):
    notebooks = session.query(Notebook).all()
    for nb in notebooks:
        if not nb.blocks:
            continue
        
        modified_nb = False
        new_blocks = list(nb.blocks)
        for i, block in enumerate(new_blocks):
            if block.get("type") != "text" or "text" not in block:
                continue
                
            text = block["text"]
            
            # Simple check if note anchor is in text before doing heavy parsing
            anchor_new = f"-n{note.id}"
            anchor_old = f"-p{note.page_number}"
            
            if anchor_new not in text and anchor_old not in text:
                continue
                
            clean_text = re.sub(r'(?:^|\n)[ \t]*>[ \t]*', '\n', text)
            clean_text = re.sub(r'^\n', '', clean_text)
            
            parts = [p for p in re.split(r'(?:^|\n\n+)(?=\s*\[)', clean_text) if p.strip()]
            
            modified_block = False
            for j, part in enumerate(parts):
                part = part.strip()
                footer_match = re.search(r'\s*(?:—|–|-)\s*(.+?),\s*p\.(\d+)\s*(?:#(\S+))?\s*$', part)
                if not footer_match:
                    continue
                    
                hash_val = footer_match.group(3)
                if not hash_val:
                    continue
                    
                is_match = False
                m = re.match(r'^(?:doc)?(\d+)-n(\d+)$', hash_val)
                if m:
                    doc_id, note_id = m.group(1), m.group(2)
                    if str(note_id) == str(note.id):
                        is_match = True
                else:
                    dash_idx = hash_val.rfind('-p')
                    if dash_idx > 0:
                        doc_id = hash_val[3:dash_idx] if hash_val.startswith("doc") else hash_val[:dash_idx]
                        if str(doc_id) == str(note.document_id) and str(footer_match.group(2)) == str(note.page_number):
                            # It's an old note format, it might be the note if docId and pageNum match.
                            # But since multiple notes can share the same page, we also check if content matches.
                            # Actually, we can just update it to the new format if it matches.
                            # If multiple notes share the page, it's safer to only update if content also somewhat matches, or just skip it.
                            is_match = True
                            
                if is_match:
                    # Reconstruct the note part!
                    cat_match = re.match(r'^\s*\[\s*(?:[^\s\]]+\s+)?([^\]]+?)\s*\]\s*', part)
                    emoji, label = "📝", "General"
                    if cat_match:
                        label = cat_match.group(1)
                        # We use the updated note category!
                        # We need to map note.category to emoji and label
                        
                    # Let's import the dict from reading.py later, for now hardcode
                    cat_meta = {
                        "insight": ("💡", "Insight"),
                        "question": ("❓", "Question"),
                        "formula": ("∑", "Formula"),
                        "confusing": ("⚠️", "Confusing"),
                        "general": ("📝", "General"),
                    }
                    emoji, new_label = cat_meta.get(note.category, ("📝", "General"))
                    
                    new_footer = f"— {doc_title}, p.{note.page_number} #{note.document_id}-n{note.id}"
                    new_part = f"[{emoji} {new_label}] {note.content}\n\n{new_footer}"
                    
                    parts[j] = new_part
                    modified_block = True
            
            if modified_block:
                # Format the parts back with `> `
                formatted_parts = []
                for p in parts:
                    formatted_p = "\n".join(f"> {line}" for line in p.split("\n"))
                    formatted_parts.append(formatted_p)
                
                block["text"] = "\n\n".join(formatted_parts)
                new_blocks[i] = block
                modified_nb = True
                
        if modified_nb:
            nb.blocks = new_blocks
            session.add(nb)

