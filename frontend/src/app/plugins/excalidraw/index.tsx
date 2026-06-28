import { PencilRuler } from "lucide-react";
import { Whiteboards } from "../../pages/Whiteboards";
import { WhiteboardEditor } from "../../pages/WhiteboardEditor";
import type { PluginDefinition } from "../types";

export const excalidrawPlugin: PluginDefinition = {
  id: "excalidraw",
  name: "Excalidraw Whiteboards",
  description:
    "Free-form visual canvas for sketching, problem solving, and spatial learning. Integrates with AI to generate, explain, and expand diagrams.",
  version: "1.0.0",
  icon: PencilRuler,
  builtIn: true,
  navItems: [
    { label: "Whiteboards", to: "/whiteboards", icon: PencilRuler, group: "study" },
  ],
  routes: [
    { path: "/whiteboards", element: <Whiteboards /> },
    { path: "/whiteboards/:id", element: <WhiteboardEditor /> },
  ],
};
