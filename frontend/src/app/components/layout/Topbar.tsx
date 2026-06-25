import { useLocation } from "react-router";
import { Command, Plus } from "lucide-react";
import { navItems } from "../../lib/nav";
import { useUIStore } from "../../stores/useUIStore";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { JobsIndicator } from "../JobsIndicator";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Your learning at a glance" },
  "/knowledge": {
    title: "Knowledge Explorer",
    subtitle: "Navigate your personal knowledge graph",
  },
  "/documents": {
    title: "Documents",
    subtitle: "Upload and manage source material",
  },
  "/ask": {
    title: "Ask AI",
    subtitle: "Source-grounded answers from your materials",
  },
  "/notebooks": {
    title: "Notebooks",
    subtitle: "Build your personal textbook",
  },
  "/reading": { title: "Reading", subtitle: "Deep reading, enhanced with AI" },
  "/exam": {
    title: "Exam",
    subtitle: "Simulate real exams from your materials",
  },
  "/revision": {
    title: "Revision Mode",
    subtitle: "Generate exam-ready study sheets",
  },
  "/flashcards": { title: "Flashcards", subtitle: "Spaced-repetition review" },
  "/quiz": { title: "Quizzes", subtitle: "Test your understanding" },
  "/diagrams": { title: "Diagrams", subtitle: "Generated visual explanations" },
  "/mindmaps": { title: "Mind Maps", subtitle: "Explore knowledge as a graph" },
  "/search": { title: "Search", subtitle: "Semantic search across everything" },
  "/settings": {
    title: "Settings",
    subtitle: "Configure models and preferences",
  },
};

export function Topbar() {
  const { pathname } = useLocation();
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const meta = titles[pathname] ?? { title: "ScholarAI", subtitle: "" };
  const current = navItems.find((n) => n.to === pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {current && <current.icon className="size-4 text-muted-foreground" />}
          <h2 className="truncate font-sans text-[15px] font-semibold tracking-tight">
            {meta.title}
          </h2>
        </div>
        {meta.subtitle && (
          <p className="truncate text-xs text-muted-foreground">
            {meta.subtitle}
          </p>
        )}
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-lg border border-border bg-input-background px-3 text-sm text-muted-foreground transition-colors hover:border-ring/50 md:flex"
      >
        <Command className="size-4" />
        <span>Search or jump to…</span>
        <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <JobsIndicator />

      <Button
        onClick={() => toast.success("New item created")}
        className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="size-4" /> New
      </Button>
    </header>
  );
}
