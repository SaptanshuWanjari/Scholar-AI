import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { NavItem } from "../lib/nav";

export interface PluginRoute {
  path: string;
  element: ReactNode;
}

export interface PluginSettingsTab {
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: LucideIcon;
  builtIn?: boolean;
  navItems?: NavItem[];
  routes?: PluginRoute[];
  settingsTab?: PluginSettingsTab;
}
