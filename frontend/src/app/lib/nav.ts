import {
  LayoutDashboard,
  Library,
  FileText,
  Sparkles,
  NotebookPen,
  Notebook,
  BookOpen,
  Columns2,
  GraduationCap,
  Layers,
  ListChecks,
  Workflow,
  Network,
  Lightbulb,
  Milestone,
  Search,
  FolderOpen,
  Settings,
  BookMarked,
  FileSearch,
  ShieldCheck,
  Code2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  shortcut?: string;
  group: "main" | "workspace" | "study" | "system";
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, shortcut: "D", group: "main" },
  { label: "Knowledge", to: "/knowledge", icon: Library, shortcut: "K", group: "main" },
  { label: "Documents", to: "/documents", icon: FileText, shortcut: "O", group: "main" },
  { label: "Courses", to: "/courses", icon: FolderOpen, shortcut: "C", group: "workspace" },
  { label: "Code Library", to: "/code-library", icon: Code2, shortcut: "L", group: "workspace" },
  { label: "Ask AI", to: "/ask", icon: Sparkles, shortcut: "A", group: "main" },
  { label: "Notebooks", to: "/notebooks", icon: Notebook, shortcut: "N", group: "workspace" },
  { label: "Reading", to: "/reading", icon: BookOpen, shortcut: "E", group: "workspace" },
  { label: "Exam", to: "/exam", icon: GraduationCap, shortcut: "X", group: "workspace" },
  { label: "PYQ Analysis", to: "/exam-analysis", icon: FileSearch, shortcut: "Y", group: "workspace" },
  { label: "Teach Me", to: "/teach", icon: Lightbulb, shortcut: "T", group: "study" },
  { label: "Learning Path", to: "/learning-path", icon: Milestone, shortcut: "J", group: "study" },
  { label: "Revision", to: "/revision", icon: NotebookPen, shortcut: "R", group: "study" },
  { label: "Flashcards", to: "/flashcards", icon: Layers, shortcut: "F", group: "study" },
  { label: "Quiz", to: "/quiz", icon: ListChecks, shortcut: "Q", group: "study" },
  { label: "Diagrams", to: "/diagrams", icon: Workflow, shortcut: "G", group: "study" },
  { label: "Mind Maps", to: "/mindmaps", icon: Network, shortcut: "M", group: "study" },
  { label: "Differences", to: "/differences", icon: Columns2, shortcut: "I", group: "study" },
  { label: "Consistency", to: "/consistency", icon: ShieldCheck, shortcut: "Z", group: "study" },
  { label: "Search", to: "/search", icon: Search, shortcut: "S", group: "system" },
  { label: "Prompts", to: "/prompts", icon: BookMarked, shortcut: "P", group: "system" },
  { label: "Settings", to: "/settings", icon: Settings, shortcut: ",", group: "system" },
];
