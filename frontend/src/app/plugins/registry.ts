import { excalidrawPlugin } from "./excalidraw";
import { plantumlPlugin } from "./plantuml";
import type { PluginDefinition } from "./types";

export const KNOWN_PLUGINS: PluginDefinition[] = [excalidrawPlugin, plantumlPlugin];
