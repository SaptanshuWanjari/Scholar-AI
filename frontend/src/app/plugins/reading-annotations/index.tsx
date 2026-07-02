import { NotebookPen, Settings2 } from "lucide-react";
import { ReadingAnnotationsSettings } from "./ReadingAnnotationsSettings";
import type { PluginDefinition } from "../types";

// A plugin layered on top of Excalidraw: it adds a Workspace pane to Reading
// mode. Sticky notes work without Excalidraw; region drawing needs Excalidraw.
// No nav items / routes — it surfaces inside the existing Reading page.
export const readingAnnotationsPlugin: PluginDefinition = {
  id: "reading-annotations",
  name: "Reading Annotations",
  description:
    "Categorized sticky notes and region annotations inside Reading mode. Notes work standalone; freehand drawing uses the Excalidraw plugin.",
  version: "1.0.0",
  icon: NotebookPen,
  npmPackages: [],
  settingsTab: {
    label: "Reading annotations",
    icon: Settings2,
    content: <ReadingAnnotationsSettings />,
  },
};
