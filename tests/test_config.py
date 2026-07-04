from scholarai.config import get_settings


def test_ingest_config_defaults():
    cfg = get_settings().ingest
    assert cfg.ocr_workers == 4
    assert cfg.ocr_cache_enabled is True
    assert cfg.tesseract_fallback is True
