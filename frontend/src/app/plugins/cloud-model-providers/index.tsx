import { Cloud } from "lucide-react";
import type { PluginDefinition } from "../types";

// No routes or navItems — this plugin only adds sub-tabs to Settings > Models.
// The sub-tabs are compiled in but gated by isEnabled("cloud-model-providers").
export const cloudModelProvidersPlugin: PluginDefinition = {
  id: "cloud-model-providers",
  name: "Cloud Model Providers",
  description:
    "Connect external AI providers (Gemini, Groq, OpenRouter) to use cloud models alongside your local models.",
  version: "1.0.0",
  minAppVersion: "0.1.0",
  icon: Cloud,
  npmPackages: [],
  navItems: [],
  routes: [],
};
