"""API contract tests for /api/courses."""

from fastapi.testclient import TestClient


def test_list_courses_empty(client: TestClient):
    resp = client.get("/api/courses")
    assert resp.status_code == 200
    assert resp.json() == []


def test_create_course(client: TestClient):
    resp = client.post("/api/courses", json={"name": "API Test Course"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "API Test Course"
    assert data["code"]
    assert data["id"]


def test_create_course_requires_name(client: TestClient):
    resp = client.post("/api/courses", json={"name": "  "})
    assert resp.status_code == 400


def test_list_courses_after_create(client: TestClient):
    client.post("/api/courses", json={"name": "Listed Course"})
    resp = client.get("/api/courses")
    assert resp.status_code == 200
    names = [c["name"] for c in resp.json()]
    assert "Listed Course" in names


def test_update_course(client: TestClient):
    create_resp = client.post("/api/courses", json={"name": "Old Name"})
    course_id = create_resp.json()["id"]

    resp = client.put(f"/api/courses/{course_id}", json={"name": "New Name"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "New Name"


def test_delete_course(client: TestClient):
    create_resp = client.post("/api/courses", json={"name": "To Delete"})
    course_id = create_resp.json()["id"]

    resp = client.delete(f"/api/courses/{course_id}")
    assert resp.status_code == 204

    list_resp = client.get("/api/courses")
    names = [c["name"] for c in list_resp.json()]
    assert "To Delete" not in names


def test_course_stats_not_found(client: TestClient):
    resp = client.get("/api/courses/99999/stats")
    assert resp.status_code == 404
