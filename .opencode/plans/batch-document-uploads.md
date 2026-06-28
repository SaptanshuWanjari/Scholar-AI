# Batch Document Uploads + Worker Pool

## Goal
Replace single-file upload with multi-file drag-and-drop + concurrent uploading, and replace `BackgroundTasks` with a bounded `ThreadPoolExecutor` worker pool to limit concurrent ingestion.

## Files

### 1. CREATE: `scholarcli/api/worker_pool.py`
ThreadPoolExecutor wrapper. Three module-level functions:
- `start_pool(max_workers=3)` — creates executor
- `stop_pool()` — shuts down executor
- `get_pool()` — returns executor (raises if not started)

### 2. MODIFY: `scholarcli/config.py`
Add `max_concurrent: int = 3` to `IngestConfig` class.

### 3. MODIFY: `config/default.toml`
Add `max_concurrent = 3` under `[ingest]` section.

### 4. MODIFY: `scholarcli/api/app.py`
In `lifespan()`:
- On startup: `from scholarcli.api.worker_pool import start_pool, stop_pool` + `start_pool(get_settings().ingest.max_concurrent)`
- On shutdown: `stop_pool()`

### 5. MODIFY: `scholarcli/api/routers/documents.py`
- Remove `BackgroundTasks` import and type annotation from `upload_document`
- Replace `background_tasks.add_task(_ingest_bg, ...)` with `get_pool().submit(_ingest_bg, ...)`
- Import: `from scholarcli.api.worker_pool import get_pool`

### 6. MODIFY: `frontend/src/app/pages/Documents.tsx`
Add multi-file upload state machine. Key changes:

**New types:**
```typescript
interface UploadItem {
  id: string;
  file: File;
  status: "queued" | "uploading" | "processing" | "completed" | "failed";
  error?: string;
}
```

**New state:**
- `uploads: UploadItem[]` — tracks all queued/in-flight files
- `CONCURRENCY_LIMIT = 3` — max parallel uploads

**Changed behavior:**
- File input gets `multiple` attribute
- Drag-drop handler processes all `files` (not just `[0]`)
- When files added → show progress panel instead of default drop zone
- Upload loop: run up to 3 concurrent upload+pickle cycles, each one:
  1. status = "uploading"
  2. `api.uploadDocument(file, target)`
  3. status = "processing"
  4. `api.pollJobUntilDone(doc.jobId)`
  5. status = "completed" or "failed"
  6. pick next queued file
- When all done → refresh document list, clear queue, restore drop zone

**UI changes:**
- Drop zone morphs into upload progress panel when `uploads.length > 0`
- Panel shows: overall progress bar, per-file status in a compact list
- "Cancel" button to clear remaining queued items
- After completion, brief toast + auto-refresh
