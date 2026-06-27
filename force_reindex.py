from scholarcli.storage import get_session
from scholarcli.storage.models import Document
from scholarcli.ingest.pipeline import ingest_file
from pathlib import Path

session = get_session()
docs = session.query(Document).filter(Document.path.like("%Microservices From Design to Deploy.pdf")).all()
for d in docs:
    print(f"Forcing reindex for {d.path}")
    d.content_hash = "force-reindex-table"
session.commit()

for d in docs:
    print(f"Reindexing {d.path}")
    ingest_file(Path(d.path), d.course.name)
session.close()
