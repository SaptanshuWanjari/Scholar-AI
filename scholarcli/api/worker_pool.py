from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor

_executor: ThreadPoolExecutor | None = None


def start_pool(max_workers: int = 3) -> None:
    global _executor
    if _executor is None:
        _executor = ThreadPoolExecutor(max_workers=max_workers, thread_name_prefix="ingest")


def stop_pool() -> None:
    global _executor
    if _executor:
        _executor.shutdown(wait=False)
        _executor = None


def get_pool() -> ThreadPoolExecutor:
    assert _executor is not None, "worker pool not started"
    return _executor
