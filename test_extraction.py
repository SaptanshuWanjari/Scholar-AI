import fitz

def test_extract(pdf_path):
    doc = fitz.open(pdf_path)
    for i in range(min(5, len(doc))):
        page = doc[i]
        
        try:
            tables = page.find_tables()
            table_bboxes = [fitz.Rect(t.bbox) for t in getattr(tables, "tables", [])] if tables else []
        except Exception:
            table_bboxes = []
            
        drawings = page.get_drawings()
        bboxes = []
        for d in drawings:
            r = d["rect"]
            if r.width > 20 and r.height > 20:
                bboxes.append(r)
                
        merged = []
        for r in bboxes:
            found = False
            for j, m in enumerate(merged):
                inflated = fitz.Rect(r.x0 - 10, r.y0 - 10, r.x1 + 10, r.y1 + 10)
                if inflated.intersects(m):
                    merged[j] = m | r
                    found = True
                    break
            if not found:
                merged.append(r)
                
        changed = True
        while changed:
            changed = False
            new_merged = []
            while merged:
                current = merged.pop(0)
                j = 0
                while j < len(merged):
                    inflated = fitz.Rect(current.x0 - 20, current.y0 - 20, current.x1 + 20, current.y1 + 20)
                    if inflated.intersects(merged[j]):
                        current = current | merged.pop(j)
                        changed = True
                    else:
                        j += 1
                new_merged.append(current)
            merged = new_merged
            
        diagrams = []
        for m in merged:
            if m.width > 50 and m.height > 50:
                is_table = False
                for tbox in table_bboxes:
                    intersect = fitz.Rect(m).intersect(tbox)
                    if intersect.width > 0 and intersect.height > 0:
                        if (intersect.width * intersect.height) > 0.5 * (m.width * m.height):
                            is_table = True
                            break
                if not is_table:
                    diagrams.append(m)
                    
        print(f"Page {i+1}: {len(diagrams)} diagrams found")

print("Created test script")
