"""Static plugin catalog — source of truth for known plugins and their npm packages."""

from __future__ import annotations

PLUGIN_CATALOG: list[dict] = [
    {
        "id": "excalidraw",
        "name": "Excalidraw Whiteboards",
        "description": "Free-form visual canvas for sketching, problem solving, and spatial learning.",
        "npm_packages": ["@excalidraw/excalidraw", "@excalidraw/mermaid-to-excalidraw"],
        "default_installed": False,
    },
    {
        "id": "plantuml",
        "name": "PlantUML Diagrams",
        "description": "UML and architecture diagram rendering via PlantUML system binary.",
        "npm_packages": [],
        "default_installed": False,
    },
    {
        "id": "reading-annotations",
        "name": "Reading Annotations",
        "description": "Sticky notes and region annotations while reading documents.",
        "npm_packages": [],
        "default_installed": False,
    },
]
