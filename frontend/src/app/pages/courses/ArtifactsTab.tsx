import { useState } from "react";
import { Layers, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import type { ArtifactItem } from "../../lib/types";
import { cn } from "../../components/ui/utils";
import { fmtDate, ARTIFACT_LABEL, ARTIFACT_ROUTE, ARTIFACT_ICON } from "./helpers";

const ARTIFACT_FILTERS = [
  { label: "All", value: null },
  { label: "Decks", value: "deck" },
  { label: "Quizzes", value: "quiz" },
  { label: "Notebooks", value: "notebook" },
  { label: "Diagrams", value: "diagram" },
  { label: "Mind Maps", value: "mindmap" },
  { label: "Differences", value: "difference_table" },
  { label: "Revisions", value: "revision" },
];

interface ArtifactsTabProps {
  artifacts: ArtifactItem[];
  typeFilter: string | null;
  setTypeFilter: (t: string | null) => void;
  navigate: ReturnType<typeof useNavigate>;
  courseName: string;
}

export function ArtifactsTab({ artifacts, typeFilter, setTypeFilter, navigate, courseName }: ArtifactsTabProps) {
  const visible = typeFilter ? artifacts.filter((a) => a.type === typeFilter) : artifacts;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {ARTIFACT_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setTypeFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              typeFilter === f.value
                ? "bg-violet text-white"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-border bg-card flex flex-col items-center py-16 text-center">
          <div className="size-14 rounded-full bg-accent flex items-center justify-center mb-4">
            <Layers className="size-7 text-muted-foreground" />
          </div>
          <h3 className="font-medium">No {typeFilter ? ARTIFACT_LABEL[typeFilter] : "artifacts"} yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Generate from any document in this course.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["/flashcards", "/quiz", "/diagrams", "/mindmaps", "/differences"].map((route) => (
              <Button key={route} size="sm" variant="outline" onClick={() => navigate(route)}>
                {route.replace("/", "").replace("-", " ")}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Title</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-36">Type</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-28">Created</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {visible.map((a) => {
                const Icon = ARTIFACT_ICON[a.type] ?? FileText;
                return (
                  <tr key={`${a.type}-${a.id}`} className="hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="truncate max-w-xs">{a.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-violet/10 text-violet">
                        {ARTIFACT_LABEL[a.type] ?? a.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{fmtDate(a.created_at)}</td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => navigate(ARTIFACT_ROUTE[a.type] ?? "/")}
                      >
                        View <ArrowRight className="size-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
