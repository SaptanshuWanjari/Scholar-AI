"""LanceDB backup — nightly + manual."""

from __future__ import annotations

import asyncio
import logging
import shutil
from datetime import datetime, timedelta, timezone
from pathlib import Path

from scholarcli.config import get_settings

logger = logging.getLogger(__name__)

BACKUP_PREFIX = "lancedb_backup_"
KEEP = 3


def _backup_dir() -> Path:
    return get_settings().paths.resolved_data_dir()


def _backup_paths() -> list[Path]:
    parent = _backup_dir()
    dirs = sorted(
        (d for d in parent.iterdir() if d.is_dir() and d.name.startswith(BACKUP_PREFIX)),
        key=lambda d: d.name,
        reverse=True,
    )
    return dirs


def create_backup() -> dict:
    settings = get_settings()
    src = settings.lancedb_path
    if not src.is_dir():
        raise RuntimeError(f"LanceDB directory not found: {src}")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    dst = _backup_dir() / f"{BACKUP_PREFIX}{stamp}"

    logger.info("Backing up %s → %s", src, dst)
    shutil.copytree(src, dst, ignore_dangling_symlinks=True)

    # prune old backups
    all_backups = _backup_paths()
    for old in all_backups[KEEP:]:
        logger.info("Removing old backup: %s", old)
        shutil.rmtree(old, ignore_errors=True)

    return {"path": str(dst), "stamp": stamp, "size_mb": _dir_size_mb(dst)}


def list_backups() -> list[dict]:
    backups = []
    for d in _backup_paths():
        stamp = d.name.removeprefix(BACKUP_PREFIX)
        backups.append({
            "path": str(d),
            "stamp": stamp,
            "size_mb": _dir_size_mb(d),
        })
    return backups


def _dir_size_mb(path: Path) -> float:
    total = sum(f.stat().st_size for f in path.rglob("*") if f.is_file())
    return round(total / (1024 * 1024), 2)


async def start_backup_scheduler():
    now = datetime.now(timezone.utc)
    next_run = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    delay = (next_run - now).total_seconds()

    logger.info("Next nightly backup at %s (in %.0f seconds)", next_run, delay)
    await asyncio.sleep(delay)

    while True:
        try:
            result = create_backup()
            logger.info("Nightly backup done: %s", result["path"])
        except Exception:
            logger.exception("Nightly backup failed")

        await asyncio.sleep(24 * 3600)
