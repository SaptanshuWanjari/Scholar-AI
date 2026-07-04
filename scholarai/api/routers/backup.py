"""Admin endpoints for manual LanceDB backup."""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from scholarai.services.backup_service import create_backup, list_backups

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/backup")
async def trigger_backup() -> dict:
    try:
        result = create_backup()
        logger.info("Manual backup: %s", result["path"])
        return {"status": "ok", "backup": result}
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception("Manual backup failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/backups")
async def get_backups() -> list[dict]:
    return list_backups()
