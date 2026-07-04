# Packaging ScholarAI for End Users

## Goal

Distribute ScholarAI as a self-hosted desktop application via GitHub Releases. End users download a pre-built archive, run a single setup script, and access the full stack (React frontend + FastAPI backend + CLI) from their browser.

The GitHub repository remains a development monorepo — dev files never appear in releases.

## Release Artifact Layout

```
ScholarAI-v0.1.0/
├── scholarcli/                    # Python package (production source)
├── frontend/dist/                 # Pre-built static files (vite build)
├── config/default.toml            # Default Ollama model config
├── requirements.txt               # Pinned production deps (uv pip compile)
├── pyproject.toml                 # Project metadata (no dev groups)
├── setup.sh                       # Linux/macOS launcher
├── setup.ps1                      # Windows launcher
└── README.md
```

**Excluded (in repo but not in release):**
- `tests/`, `context/`, `reports/`, `docs/`, `paper-ui/`
- `frontend/src/`, `frontend/node_modules/`, `frontend/*.config.*`
- `.venv/`, `__pycache__/`, `.pytest_cache/`, `.data/`
- `.github/`, `.idea/`, `.opencode/`, `.superpowers/`, `.claude/`
- All dotfiles not required at runtime

## Distribution Channel

- **Platform:** GitHub Releases (triggered by tags like `v0.1.0`)
- **Archives:** `ScholarAI-v0.1.0-linux.tar.gz`, `ScholarAI-v0.1.0-macos.tar.gz`, `ScholarAI-v0.1.0-windows.zip`
- **Versioning:** Semver from git tags (same as repo)

## Build Pipeline (GitHub Actions)

1. **Setup** — Python 3.12 (uv), Node 20 (npm)
2. **Build Python** — `uv build` → `.whl` in `dist/`
3. **Build frontend** — `npm ci && npm run build` → `frontend/dist/`
4. **Pin deps** — `uv pip compile pyproject.toml --output-file=requirements.txt` (production only)
5. **Assemble** — copy runtime files into staging dir, strip dev files
6. **Archive** — platform-specific archive per runner OS
7. **Publish** — create GitHub Release with archives attached

## User Install Flow

```
# Download and extract
tar xzf ScholarAI-v0.1.0-linux.tar.gz
cd ScholarAI-v0.1.0

# One-time setup + launch
./setup.sh
# → creates .venv, pip installs deps, starts uvicorn on :8000

# Open http://localhost:8000 in browser
```

`setup.sh` / `setup.ps1` are thin scripts:
- Create Python venv
- `pip install -r requirements.txt` (no uv required)
- Start `uvicorn scholarcli.api.app:app --host 0.0.0.0 --port 8000`

## Backend Changes Required

- **Static file mount:** Serve `frontend/dist/` via FastAPI's `StaticFiles` + SPA catch-all route
- **Title/version:** `app.py` currently says "ScholarCLI API" — update to "ScholarAI"
- **CORS origins:** Keep localhost origins for dev; add `None` for production (same-origin)

## What Stays the Same

- Repo structure for developers is unchanged
- `uv sync` / `npm run dev` still works as before
- All dev tooling (storybook, tests, paper-ui, tsconfig, etc.) remains in repo

## Future Considerations (not in scope)

- `pip install scholarcli` via PyPI
- ARM64 runners for macOS/Windows
- Auto-update mechanism
- Standalone binary via PyInstaller
