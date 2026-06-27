from collections import Counter
def get_mode_size(blocks):
    c = Counter()
    for b in blocks:
        if b.get("type") == 0:
            for line in b.get("lines", []):
                for span in line.get("spans", []):
                    c[span.get("size", 0)] += len(span.get("text", "").strip())
    if not c:
        return 0
    return c.most_common(1)[0][0]
