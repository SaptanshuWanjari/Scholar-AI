import { Layers, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import type { ArtifactItem } from "../../lib/types";
import { cn } from "@/paper-ui/utils";
import { PaperButton } from "@/paper-ui/components/buttons";
import { ChipButton } from "@/paper-ui/components/buttons";
import { PaperTable, TableHeader, PaperTh, TableRow, PaperTd, EmptyTable } from "@/paper-ui/components/tables";
import { PaperBadge } from "@/paper-ui/components/badges";
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
          <ChipButton key={f.label} selected={typeFilter === f.value} onClick={() => setTypeFilter(f.value)}>
            {f.label}
          </ChipButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-[#e4e0d6] bg-paper-card flex flex-col items-center py-16 text-center">
          <div className="size-14 rounded-full bg-paper-panel flex items-center justify-center mb-4">
            <Layers className="size-7 text-ink-muted" />
          </div>
          <h3 className="font-kalam text-lg font-bold text-ink">No {typeFilter ? ARTIFACT_LABEL[typeFilter] : "artifacts"} yet</h3>
          <p className="font-architect text-sm text-ink-muted mt-1 mb-5">Generate from any document in this course.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["/flashcards", "/quiz", "/diagrams", "/mindmaps", "/differences"].map((route) => (
              <PaperButton key={route} size="sm" tone="paper" onClick={() => navigate(route)}>
                {route.replace("/", "").replace("-", " ")}
              </PaperButton>
            ))}
          </div>
        </div>
      ) : (
        <PaperTable>
          <TableHeader>
            <tr>
              <PaperTh>Title</PaperTh>
              <PaperTh className="w-36">Type</PaperTh>
              <PaperTh className="w-28">Created</PaperTh>
              <PaperTh className="w-20"></PaperTh>
            </tr>
          </TableHeader>
          <tbody className="divide-y divide-[#e8e3d8]">
            {visible.map((a, i) => {
              const Icon = ARTIFACT_ICON[a.type] ?? FileText;
              return (
                <TableRow key={`${a.type}-${a.id}`} index={i}>
                  <PaperTd>
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-lg bg-paper-panel flex items-center justify-center shrink-0">
                        <Icon className="size-3.5 text-ink-muted" />
                      </div>
                      <span className="truncate max-w-xs font-kalam text-[14px] text-ink">{a.title}</span>
                    </div>
                  </PaperTd>
                  <PaperTd>
                    <PaperBadge tone="lavender">{ARTIFACT_LABEL[a.type] ?? a.type}</PaperBadge>
                  </PaperTd>
                  <PaperTd className="font-architect text-[13px] text-ink-muted">{fmtDate(a.created_at)}</PaperTd>
                  <PaperTd>
                    <PaperButton size="sm" tone="paper" className="h-7 px-2 text-xs" onClick={() => navigate(ARTIFACT_ROUTE[a.type] ?? "/")}>
                      View <ArrowRight className="size-3" />
                    </PaperButton>
                  </PaperTd>
                </TableRow>
              );
            })}
          </tbody>
        </PaperTable>
      )}
    </div>
  );
}
