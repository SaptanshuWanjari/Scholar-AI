import {
  Home, BookOpen, FileText, Layers, CheckSquare, Map, Lightbulb,
  Notebook, Network, PenTool, Repeat, FileQuestion, Settings,
  LibraryBig, FileCheck2, Clock, Sparkles, type LucideIcon,
} from "lucide-react";
import type { IconTone } from "../components/paper";

export interface SidebarEntry {
  icon: LucideIcon;
  label: string;
}

/** Flat list kept for reference — prefer SIDEBAR_GROUPS for the page. */
export const SIDEBAR_ITEMS: SidebarEntry[] = [
  { icon: Home, label: "Home" },
  { icon: BookOpen, label: "Courses" },
  { icon: FileText, label: "Documents" },
  { icon: Layers, label: "Flashcards" },
  { icon: CheckSquare, label: "Quizzes" },
  { icon: Map, label: "Learning Paths" },
  { icon: Lightbulb, label: "Teach Me" },
  { icon: Notebook, label: "Notebook" },
  { icon: Network, label: "Mindmaps" },
  { icon: PenTool, label: "Diagrams" },
  { icon: Repeat, label: "Revision" },
  { icon: FileQuestion, label: "PYQ" },
  { icon: Settings, label: "Settings" },
];

export interface SidebarGroupEntry {
  label?: string;
  items: SidebarEntry[];
}

/** Grouped sidebar navigation used by the DashboardClone page. */
export const SIDEBAR_GROUPS: SidebarGroupEntry[] = [
  {
    label: "Study",
    items: [
      { icon: Home, label: "Home" },
      { icon: BookOpen, label: "Courses" },
      { icon: FileText, label: "Documents" },
      { icon: Layers, label: "Flashcards" },
      { icon: CheckSquare, label: "Quizzes" },
    ],
  },
  {
    label: "Create",
    items: [
      { icon: Notebook, label: "Notebook" },
      { icon: Network, label: "Mindmaps" },
      { icon: PenTool, label: "Diagrams" },
    ],
  },
  {
    label: "Practice",
    items: [
      { icon: Map, label: "Learning Paths" },
      { icon: Lightbulb, label: "Teach Me" },
      { icon: Repeat, label: "Revision" },
      { icon: FileQuestion, label: "PYQ" },
    ],
  },
];

export interface CommandSeed {
  key: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  navTarget?: string;
}

/** Raw command seeds — DashboardClone wraps these with actual action handlers. */
export const COMMAND_SEEDS: CommandSeed[] = [
  { key: "ask-ai",        label: "Ask AI",             description: "Chat with your study assistant",  icon: Sparkles },
  { key: "teach-me",      label: "Teach Me",           description: "Generate flashcards or an outline", icon: Lightbulb },
  { key: "home",          label: "Go to Home",         icon: Home,         navTarget: "Home" },
  { key: "courses",       label: "View Courses",       icon: BookOpen,     navTarget: "Courses" },
  { key: "documents",     label: "All Documents",      icon: FileText,     navTarget: "Documents" },
  { key: "flashcards",    label: "Flashcard Decks",    icon: Layers,       navTarget: "Flashcards" },
  { key: "quizzes",       label: "Quizzes",            icon: CheckSquare,  navTarget: "Quizzes" },
  { key: "notebook",      label: "Open Notebook",      icon: Notebook,     navTarget: "Notebook" },
  { key: "mindmaps",      label: "Mindmaps",           icon: Network,      navTarget: "Mindmaps" },
  { key: "settings",      label: "Settings",           icon: Settings,     navTarget: "Settings" },
];

export const GREETING = "Good afternoon, Saptanshu.";

export const LEARNING_PATH = {
  course: "Artificial Intelligence",
  percent: 33,
  nextTitle: "Game Trees",
  nextNote: "All prerequisites complete",
};

export interface StatEntry {
  icon: LucideIcon;
  tone: IconTone;
  label: string;
  sublabel: string;
  value: number;
}

export const STATS: StatEntry[] = [
  { icon: FileText, tone: "lavender", label: "Documents", sublabel: "1 courses", value: 4 },
  { icon: Layers, tone: "ochre", label: "Cards due today", sublabel: "Review today", value: 8 },
  { icon: LibraryBig, tone: "sky", label: "Total Flashcards", sublabel: "Across all decks", value: 8 },
  { icon: FileCheck2, tone: "sage", label: "Quizzes taken", sublabel: "Total attempts", value: 2 },
  { icon: Clock, tone: "brick", label: "Study sessions", sublabel: "Recorded sessions", value: 7 },
];

export interface DocEntry {
  title: string;
  meta: string;
  date: string;
  iconClass: string;
  starred: boolean;
}

export const RECENT_DOCUMENTS: DocEntry[] = [
  { title: "UNIT - IV.pptx", meta: "AI · 27 pages", date: "2026-06-28", iconClass: "text-ochre", starred: false },
  { title: "Unit III.pptx", meta: "AI · 10 pages", date: "2026-06-28", iconClass: "text-sage", starred: false },
  { title: "UNIT - II.pptx", meta: "AI · 32 pages", date: "2026-06-28", iconClass: "text-sky", starred: false },
  { title: "UNIT-I.pptx", meta: "AI · 43 pages", date: "2026-06-28", iconClass: "text-lavender", starred: false },
];

export interface SessionEntry {
  text: string;
  duration: string;
  ago: string;
}

export const RECENT_SESSIONS: SessionEntry[] = [
  { text: "Asked: Explain the concept: Mini...", duration: "3m", ago: "16h ago" },
  { text: "Asked: Explain the concept: Term...", duration: "3m", ago: "16h ago" },
  { text: "Asked: Explain the concept: Maxi...", duration: "3m", ago: "16h ago" },
  { text: "Asked: Explain the concept: Gam...", duration: "3m", ago: "16h ago" },
];
