import { lazy, Suspense } from "react";
import { PencilRuler, Settings2 } from "lucide-react";
import { WhiteboardSettings } from "./WhiteboardSettings";
import type { PluginDefinition } from "../types";

const Whiteboards = lazy(() =>
  import("../../pages/Whiteboards").then((m) => ({ default: m.Whiteboards }))
);
const WhiteboardEditor = lazy(() =>
  import("../../pages/WhiteboardEditor").then((m) => ({ default: m.WhiteboardEditor }))
);

export const excalidrawPlugin: PluginDefinition = {
  id: "excalidraw",
  name: "Excalidraw Whiteboards",
  description:
    "Free-form visual canvas for sketching, problem solving, and spatial learning. Integrates with AI to generate, explain, and expand diagrams.",
  version: "1.0.0",
  icon: PencilRuler,
  npmPackages: ["@excalidraw/excalidraw", "@excalidraw/mermaid-to-excalidraw"],
  navItems: [
    { label: "Whiteboards", to: "/whiteboards", icon: PencilRuler, group: "study" },
  ],
  routes: [
    { path: "/whiteboards", element: <Suspense fallback={null}><Whiteboards /></Suspense> },
    { path: "/whiteboards/:id", element: <Suspense fallback={null}><WhiteboardEditor /></Suspense> },
  ],
  settingsTab: {
    label: "Whiteboard settings",
    icon: Settings2,
    content: <WhiteboardSettings />,
  },
};
