import { Network, HelpCircle } from "lucide-react";
import { PlantUMLSettings } from "./PlantUMLSettings";
import type { PluginDefinition } from "../types";

export const plantumlPlugin: PluginDefinition = {
  id: "plantuml",
  name: "PlantUML Diagrams",
  description:
    "Render UML diagrams, state machines, sequence flows, and architecture schematics from PlantUML syntax. Requires a local Java runtime and the plantuml binary.",
  version: "1.0.0",
  minAppVersion: "0.1.0",
  icon: Network,
  npmPackages: [],
  settingsTab: {
    label: "Setup & Requirements",
    icon: HelpCircle,
    content: <PlantUMLSettings />,
  },
};
