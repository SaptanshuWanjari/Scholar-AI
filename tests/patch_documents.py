import re

with open("scholarcli/api/routers/documents.py", "r") as f:
    content = f.read()

new_endpoint = """
@router.get("/documents/{document_id}/raw")
def get_document_raw(document_id: int) -> FileResponse:
    session = get_session()
    try:
        doc = session.get(Document, document_id)
        if not doc or not doc.path:
            raise HTTPException(status_code=404, detail="Document not found")
        
        path = Path(doc.path)
        if not path.exists():
            raise HTTPException(status_code=404, detail="File missing from disk")
            
        media_type = "application/pdf" if doc.file_type == "pdf" else "text/plain"
        
        # We can pass inline disposition to allow browsers to view pdfs directly
        return FileResponse(path, media_type=media_type, headers={"Content-Disposition": f'inline; filename="{doc.title}.{doc.file_type}"'})
    finally:
        session.close()
"""

# Append it at the end
content = content + "\n" + new_endpoint

with open("scholarcli/api/routers/documents.py", "w") as f:
    f.write(content)

print("Patched documents.py")
