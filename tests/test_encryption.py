"""Tests for the Fernet-based encryption module."""

from __future__ import annotations

import pytest

from scholarcli.storage.encryption import clear_cache, decrypt, encrypt


@pytest.fixture(autouse=True)
def reset_fernet_cache():
    """Flush the Fernet singleton so each test gets a fresh key from the
    temp data dir set up by the session-wide clean_config fixture."""
    clear_cache()
    yield
    clear_cache()


def test_round_trip():
    plaintext = "sk-abc123"
    assert decrypt(encrypt(plaintext)) == plaintext


def test_encrypted_differs_from_plaintext():
    plaintext = "my-api-key"
    assert encrypt(plaintext) != plaintext.encode()


def test_empty_string():
    assert decrypt(encrypt("")) == ""
