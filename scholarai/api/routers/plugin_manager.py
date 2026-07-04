"""Plugin install/uninstall/enable/disable management."""

from __future__ import annotations

import asyncio
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from scholarai.api.plugin_catalog import PLUGIN_CATALOG
from scholarai.storage import get_session
from scholarai.storage.models import PluginState

router = APIRouter(prefix="/api/plugins", tags=["plugin-manager"])

# Path to frontend/ dir (4 levels up from this file: routers/ → api/ → scholarai/ → project root → frontend/)
FRONTEND_DIR = Path(__file__).parent.parent.parent.parent / "frontend"

# Prevent concurrent npm operations
_npm_lock = asyncio.Lock()


class PluginInfo(BaseModel):
    id: str
    name: str
    description: str
    npm_packages: list[str]
    installed: bool
    enabled: bool
    installed_at: str | None  # ISO datetime string or None


class PluginActionResponse(BaseModel):
    success: bool
    message: str
    restart_required: bool
    rebuilt: bool


@router.get("", response_model=list[PluginInfo])
def list_plugins() -> list[PluginInfo]:
    """List all plugins merged from catalog + DB state."""
    session = get_session()
    try:
        result = []
        for entry in PLUGIN_CATALOG:
            state = session.get(PluginState, entry["id"])
            result.append(PluginInfo(
                id=entry["id"],
                name=entry["name"],
                description=entry["description"],
                npm_packages=entry["npm_packages"],
                installed=state.installed if state else False,
                enabled=state.enabled if state else False,
                installed_at=state.installed_at.isoformat() if (state and state.installed_at) else None,
            ))
        return result
    finally:
        session.close()


@router.post("/{plugin_id}/install", response_model=PluginActionResponse)
async def install_plugin(plugin_id: str) -> PluginActionResponse:
    """Install a plugin by running npm install and marking state in DB."""
    entry = next((p for p in PLUGIN_CATALOG if p["id"] == plugin_id), None)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_id}' not found")

    restart_required = False
    rebuilt = False

    # Run npm install if plugin has npm packages
    if entry["npm_packages"]:
        async with _npm_lock:
            npm = shutil.which("npm") or "npm"
            try:
                result = subprocess.run(
                    [npm, "install", *entry["npm_packages"]],
                    cwd=FRONTEND_DIR,
                    capture_output=True,
                    timeout=180,
                )
            except subprocess.TimeoutExpired:
                raise HTTPException(status_code=500, detail="npm install timed out (>3 min)")
            except FileNotFoundError:
                raise HTTPException(status_code=500, detail="npm not found in PATH")

            if result.returncode != 0:
                stderr = (result.stdout + result.stderr).decode(errors="replace")
                raise HTTPException(status_code=500, detail=f"npm install failed: {stderr[:500]}")

            restart_required = True

            # If built dist/ exists → production mode, rebuild
            if (FRONTEND_DIR / "dist" / "index.html").exists():
                build_result = subprocess.run(
                    [npm, "run", "build"],
                    cwd=FRONTEND_DIR,
                    capture_output=True,
                    timeout=300,
                )
                rebuilt = build_result.returncode == 0

    # Mark as installed + enabled in DB
    session = get_session()
    try:
        state = session.get(PluginState, plugin_id)
        if state is None:
            state = PluginState(plugin_id=plugin_id)
            session.add(state)
        state.installed = True
        state.enabled = True
        state.installed_at = datetime.now(timezone.utc)
        session.commit()
    finally:
        session.close()

    if restart_required:
        msg = "Plugin installed. Refresh the page to activate." if not rebuilt else "Plugin installed and frontend rebuilt. Refresh to activate."
    else:
        msg = "Plugin installed and activated."

    return PluginActionResponse(success=True, message=msg, restart_required=restart_required, rebuilt=rebuilt)


@router.post("/{plugin_id}/uninstall", response_model=PluginActionResponse)
async def uninstall_plugin(plugin_id: str) -> PluginActionResponse:
    """Uninstall a plugin by running npm uninstall and marking state in DB."""
    entry = next((p for p in PLUGIN_CATALOG if p["id"] == plugin_id), None)
    if entry is None:
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_id}' not found")

    restart_required = False
    rebuilt = False

    if entry["npm_packages"]:
        async with _npm_lock:
            npm = shutil.which("npm") or "npm"
            try:
                subprocess.run(
                    [npm, "uninstall", *entry["npm_packages"]],
                    cwd=FRONTEND_DIR,
                    capture_output=True,
                    timeout=60,
                )
            except Exception:
                pass  # Best effort; still mark as uninstalled
            restart_required = True

            if (FRONTEND_DIR / "dist" / "index.html").exists():
                build_result = subprocess.run(
                    [npm, "run", "build"],
                    cwd=FRONTEND_DIR,
                    capture_output=True,
                    timeout=300,
                )
                rebuilt = build_result.returncode == 0

    session = get_session()
    try:
        state = session.get(PluginState, plugin_id)
        if state is None:
            state = PluginState(plugin_id=plugin_id)
            session.add(state)
        state.installed = False
        state.enabled = False
        state.installed_at = None
        session.commit()
    finally:
        session.close()

    msg = "Plugin uninstalled. Refresh the page to deactivate." if restart_required else "Plugin uninstalled."
    return PluginActionResponse(success=True, message=msg, restart_required=restart_required, rebuilt=rebuilt)


@router.post("/{plugin_id}/enable", response_model=PluginActionResponse)
def enable_plugin(plugin_id: str) -> PluginActionResponse:
    """Enable a plugin (must be installed first)."""
    return _set_enabled(plugin_id, True)


@router.post("/{plugin_id}/disable", response_model=PluginActionResponse)
def disable_plugin(plugin_id: str) -> PluginActionResponse:
    """Disable a plugin."""
    return _set_enabled(plugin_id, False)


def _set_enabled(plugin_id: str, value: bool) -> PluginActionResponse:
    """Set the enabled state of a plugin."""
    if not any(p["id"] == plugin_id for p in PLUGIN_CATALOG):
        raise HTTPException(status_code=404, detail=f"Plugin '{plugin_id}' not found")
    session = get_session()
    try:
        state = session.get(PluginState, plugin_id)
        if state is None or not state.installed:
            raise HTTPException(status_code=400, detail="Plugin not installed")
        state.enabled = value
        session.commit()
    finally:
        session.close()
    action = "enabled" if value else "disabled"
    return PluginActionResponse(success=True, message=f"Plugin {action}.", restart_required=False, rebuilt=False)
