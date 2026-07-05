import { useLocation } from "react-router";
import { navItems } from "../../lib/nav";
import { useUIStore } from "../../stores/useUIStore";
import { JobsIndicator } from "../JobsIndicator";
import { HelpMenu } from "../../guidance/components/HelpMenu";
import { SketchSearch } from "@paper-ui/components/inputs";
import { SketchDivider } from "@paper-ui/components/decorations";

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
  "/courses": {
    title: "Courses",
    subtitle: "Your course workspaces",
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
  "/exam-analysis": {
    title: "PYQ Analysis",
    subtitle: "Analyze previous year questions",
  },
  "/teach": {
    title: "Teach Me",
    subtitle: "Learn concepts interactively",
  },
  "/revision": {
    title: "Revision Mode",
    subtitle: "Generate exam-ready study sheets",
  },
  "/flashcards": { title: "Flashcards", subtitle: "Spaced-repetition review" },
  "/quiz": { title: "Quizzes", subtitle: "Test your understanding" },
  "/diagrams": { title: "Diagrams", subtitle: "Generated visual explanations" },
  "/mindmaps": { title: "Mind Maps", subtitle: "Explore knowledge as a graph" },
  "/differences": {
    title: "Difference Tables",
    subtitle: "Compare concepts, architectures, algorithms and more",
  },
  "/consistency": {
    title: "Consistency",
    subtitle: "Track your learning habits",
  },
  "/search": { title: "Search", subtitle: "Semantic search across everything" },
  "/prompts": {
    title: "Prompts",
    subtitle: "Manage your system prompts",
  },
  "/guide": {
    title: "Guide",
    subtitle: "How to get the most out of ScholarAI",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Configure models and preferences",
  },
};

export function Topbar() {
  const { pathname } = useLocation();
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);
  const current = navItems.find((n) => n.to === pathname);
  const meta = titles[pathname] ?? {
    title: current?.label ?? "ScholarAI",
    subtitle: "",
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 bg-paper-surface/90 px-6 backdrop-blur-xl">

      <SketchDivider variant="wavy" color="var(--color-ink-muted, #b4ad9e)" strokeWidth={1.2} className="absolute bottom-0 left-0" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {current && <current.icon className="size-5 text-ink-muted" />}
          <h2 className="truncate font-architect text-[18px] text-ink">
            {meta.title}
          </h2>
        </div>
        {meta.subtitle && (
          <p className="truncate font-kalam text-xs text-ink-muted">
            {meta.subtitle}
          </p>
        )}
      </div>

      <SketchSearch
        readOnly
        onClick={() => setCommandOpen(true)}
        onFocus={() => setCommandOpen(true)}
        width={272}
        className="ml-auto hidden md:flex cursor-pointer"
      />

      <JobsIndicator />

      <HelpMenu />
    </header>
  );
}
