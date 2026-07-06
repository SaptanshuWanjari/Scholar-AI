"""Fernet-based symmetric encryption for API keys stored in SQLite."""

from __future__ import annotations

import os
from functools import lru_cache
from pathlib import Path

from cryptography.fernet import Fernet

from scholarai.config import get_settings


def _key_path() -> Path:
    # ponytail: key lives outside .data/ so compromise of the DB directory
    # doesn't also leak the key.  shadow DB backups still need the key in
    # a separate grab.
    return Path(get_settings().db_path).parent.parent / "scholar.key"


@lru_cache(maxsize=1)
def _get_fernet() -> Fernet:
    path = _key_path()
    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        key = Fernet.generate_key()
        path.write_bytes(key)
        os.chmod(path, 0o600)
    return Fernet(path.read_bytes())


def encrypt(value: str) -> bytes:
    """Encrypt a plaintext string to bytes."""
    return _get_fernet().encrypt(value.encode())


def decrypt(value: bytes) -> str:
    """Decrypt bytes back to a plaintext string."""
    return _get_fernet().decrypt(value).decode()


def clear_cache() -> None:
    """Call after changing data dir in tests."""
    _get_fernet.cache_clear()
