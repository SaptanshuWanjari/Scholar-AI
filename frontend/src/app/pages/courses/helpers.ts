import { FileText, Layers, ListChecks, Notebook, Workflow, Network, PencilRuler, Columns2, NotebookPen } from "lucide-react";

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const ARTIFACT_LABEL: Record<string, string> = {
  deck: "Flashcard Deck",
  quiz: "Quiz",
  notebook: "Notebook",
  diagram: "Diagram",
  mindmap: "Mind Map",
  whiteboard: "Whiteboard",
  difference_table: "Difference Table",
  revision: "Revision Sheet",
};

export const ARTIFACT_ROUTE: Record<string, string> = {
  deck: "/flashcards",
  quiz: "/quiz",
  notebook: "/notebooks",
  diagram: "/diagrams",
  mindmap: "/mindmaps",
  whiteboard: "/whiteboards",
  difference_table: "/differences",
  revision: "/revision",
};

export const ARTIFACT_ICON: Record<string, typeof FileText> = {
  deck: Layers,
  quiz: ListChecks,
  notebook: Notebook,
  diagram: Workflow,
  mindmap: Network,
  whiteboard: PencilRuler,
  difference_table: Columns2,
  revision: NotebookPen,
};
