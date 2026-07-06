"""Smoke tests for the FastAPI app itself."""

from fastapi.testclient import TestClient

from scholarai.api.app import create_app


def test_health_endpoint():
    app = create_app()
    with TestClient(app) as client:
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert "ollama_reachable" in data
        assert "embed_model" in data


def test_cors_headers_on_options():
    app = create_app()
    with TestClient(app) as client:
        resp = client.options(
            "/api/health",
            headers={
                "Origin": "http://localhost:5173",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert resp.status_code == 200
        assert "access-control-allow-origin" in resp.headers


def test_404_handler():
    app = create_app()
    with TestClient(app) as client:
        resp = client.get("/api/does-not-exist")
        assert resp.status_code == 404


def _collect_paths(routes):
    paths = set()
    for route in routes:
        if hasattr(route, "path"):
            paths.add(route.path)
        if hasattr(route, "routes"):
            paths.update(_collect_paths(route.routes))
        elif hasattr(route, "original_router") and hasattr(route.original_router, "routes"):
            paths.update(_collect_paths(route.original_router.routes))
    return paths


def test_routes_registered():
    app = create_app()
    paths = _collect_paths(app.routes)
    assert "/api/health" in paths
    assert "/api/ask" in paths or "/api/ask/" in paths
    assert "/api/courses" in paths or "/api/courses/" in paths
    assert "/api/documents" in paths or "/api/documents/" in paths
