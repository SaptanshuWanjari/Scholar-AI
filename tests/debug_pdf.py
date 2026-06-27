import fitz
import glob

pdf_path = "data/uploads/Microservices From Design to Deploy.pdf"
doc = fitz.open(pdf_path)
for i, page in enumerate(doc):
    text = page.get_text()
    if "LOAD BALANCER" in text or "Figure 1-4" in text:
        print(f"  -> Found in {pdf_path} on page {i+1}")
        
        drawings = page.get_drawings()
        bboxes = []
        for d in drawings:
            r = d["rect"]
            bboxes.append(r)
        
        merged = []
        for r in bboxes:
            found = False
            for j, m in enumerate(merged):
                inflated = fitz.Rect(r.x0 - 20, r.y0 - 20, r.x1 + 20, r.y1 + 20)
                if inflated.intersects(m):
                    merged[j] = m | r
                    found = True
                    break
            if not found:
                merged.append(r)
                
        # additional pass to merge again
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
        
        print(f"  -> Diagrams detected: {[m for m in merged if m.width > 50 and m.height > 50]}")
        
        blocks = page.get_text("dict").get("blocks", [])
        for b in blocks:
            if b.get("type") == 0:
                b_text = "".join(s["text"] for l in b["lines"] for s in l["spans"]).strip()
                if "LOAD" in b_text or "TRIP" in b_text or "EC2" in b_text:
                    bx0, by0, bx1, by1 = b["bbox"]
                    b_rect = fitz.Rect(bx0, by0, bx1, by1)
                    in_diagram = False
                    inter_areas = []
                    for dbox in merged:
                        if dbox.width > 50 and dbox.height > 50:
                            intersect = b_rect & dbox
                            original_area = b_rect.width * b_rect.height
                            if intersect.width > 0 and intersect.height > 0:
                                inter_areas.append((intersect.width * intersect.height) / original_area)
                                if (intersect.width * intersect.height) > 0.7 * original_area:
                                    in_diagram = True
                                    break
                    print(f"  -> Text block '{b_text[:20]}': {b['bbox']} | In Diagram? {in_diagram} | Overlaps: {inter_areas}")

