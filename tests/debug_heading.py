import fitz

doc = fitz.open("data/uploads/86be6f2a_Microservices From Design to Deploy.pdf")
page = doc[69]
page_dict = page.get_text("dict", sort=True)
for i, b in enumerate(page_dict.get("blocks", [])):
    if b.get("type") != 0:
        continue
    text_in_block = []
    has_large = False
    for line in b.get("lines", []):
        for span in line.get("spans", []):
            if span.get("size", 0) > 30:
                has_large = True
            text_in_block.append(span.get("text", "").strip())
    if has_large:
        print(f"Block {i}: {' '.join(filter(None, text_in_block))}")
