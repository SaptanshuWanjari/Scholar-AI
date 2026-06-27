import fitz

def get_diagram_bboxes(page):
    drawings = page.get_drawings()
    if not drawings:
        return []
    
    bboxes = []
    for d in drawings:
        r = d["rect"]
        # ignore tiny drawings (e.g. underlines or bullets)
        if r.width > 20 and r.height > 20:
            bboxes.append(r)
            
    if not bboxes:
        return []
        
    # merge intersecting bboxes
    merged = []
    for r in bboxes:
        found = False
        for i, m in enumerate(merged):
            # inflate slightly to merge nearby shapes
            inflated = fitz.Rect(r.x0 - 10, r.y0 - 10, r.x1 + 10, r.y1 + 10)
            if inflated.intersects(m):
                merged[i] = m | r
                found = True
                break
        if not found:
            merged.append(r)
            
    # merge again to combine chains
    changed = True
    while changed:
        changed = False
        new_merged = []
        while merged:
            current = merged.pop(0)
            i = 0
            while i < len(merged):
                inflated = fitz.Rect(current.x0 - 20, current.y0 - 20, current.x1 + 20, current.y1 + 20)
                if inflated.intersects(merged[i]):
                    current = current | merged.pop(i)
                    changed = True
                else:
                    i += 1
            new_merged.append(current)
        merged = new_merged
        
    # Filter out very small bounding boxes (e.g., small icons)
    # A diagram is usually substantial.
    return [m for m in merged if m.width > 50 and m.height > 50]

print("Script created")
