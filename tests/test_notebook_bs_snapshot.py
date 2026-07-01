from scholarcli.storage import get_session, init_db
from scholarcli.storage.models import Notebook


def test_bs_snapshot_roundtrip():
    init_db()
    with get_session() as s:
        nb = Notebook(title="T", blocks=[{"type": "text", "text": "hi"}],
                      bs_snapshot={"format": "blocksuite-snapshot@1", "snapshot": {"x": 1}})
        s.add(nb)
        s.commit()
        nb_id = nb.id

    with get_session() as s:
        got = s.get(Notebook, nb_id)
        assert got.bs_snapshot["format"] == "blocksuite-snapshot@1"
        assert got.blocks == [{"type": "text", "text": "hi"}]
