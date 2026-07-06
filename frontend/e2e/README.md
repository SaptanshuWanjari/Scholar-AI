# End-to-end tests

These Playwright tests exercise the full ScholarAI stack.

## Prerequisites

Both backend and frontend dev servers must be running:

```bash
# Terminal 1 — backend
uv run scholar serve

# Terminal 2 — frontend
cd frontend
npm run dev
```

## Install browsers

Run once after installing `@playwright/test`:

```bash
cd frontend
npx playwright install chromium
```

## Run tests

```bash
cd frontend
npm run test:e2e
```

Run with the Playwright UI for debugging:

```bash
npm run test:e2e:ui
```
