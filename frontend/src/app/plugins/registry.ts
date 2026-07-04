import { excalidrawPlugin } from "./excalidraw";
import { plantumlPlugin } from "./plantuml";
import { readingAnnotationsPlugin } from "./reading-annotations";
import { cloudModelProvidersPlugin } from "./cloud-model-providers";
import type { PluginDefinition } from "./types";

export const KNOWN_PLUGINS: PluginDefinition[] = [
  excalidrawPlugin,
  plantumlPlugin,
  readingAnnotationsPlugin,
  cloudModelProvidersPlugin,
];
