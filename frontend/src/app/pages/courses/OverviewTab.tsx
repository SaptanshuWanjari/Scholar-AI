import { FolderOpen, Plus, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import type { Course, DocumentItem, ArtifactItem } from "../../lib/types";
import { cn } from "../../components/ui/utils";
import { fmtDate, ARTIFACT_ICON, ARTIFACT_LABEL } from "./helpers";

interface OverviewTabProps {
  course: Course;
  documents: DocumentItem[];
  artifacts: ArtifactItem[];
  navigate: ReturnType<typeof useNavigate>;
  setActiveTab: (t: "overview" | "documents" | "artifacts") => void;
}

export function OverviewTab({ course, documents, artifacts, navigate, setActiveTab }: OverviewTabProps) {
  const recentDocs = documents.slice(0, 5);
  const recentArtifacts = artifacts.slice(0, 5);

  if (documents.length === 0 && artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-accent flex items-center justify-center mb-4">
          <FolderOpen className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No content yet</h3>
        <p className="text-muted-foreground text-sm mt-1 max-w-sm">
          Upload documents to this course, then generate study artifacts from them.
        </p>
        <Button className="mt-6" onClick={() => navigate("/documents")}>
          <Plus className="size-4 mr-2" /> Upload Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Recent Documents</h3>
          <button
            onClick={() => setActiveTab("documents")}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all <ArrowRight className="size-3" />
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {recentDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No documents</p>
          ) : recentDocs.map((d, i) => (
            <div key={d.id} className={cn("flex items-center gap-3 px-4 py-3 hover:bg-accent/40", i > 0 && "border-t border-border")}>
              <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{d.title}</div>
                <div className="text-xs text-muted-foreground">{d.pages} pages</div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{fmtDate(d.addedAt)}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">Recent Artifacts</h3>
          <button
            onClick={() => setActiveTab("artifacts")}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            View all <ArrowRight className="size-3" />
          </button>
        </div>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {recentArtifacts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No artifacts yet</p>
          ) : recentArtifacts.map((a, i) => {
            const Icon = ARTIFACT_ICON[a.type] ?? FileText;
            return (
              <div key={`${a.type}-${a.id}`} className={cn("flex items-center gap-3 px-4 py-3 hover:bg-accent/40", i > 0 && "border-t border-border")}>
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{ARTIFACT_LABEL[a.type] ?? a.type}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{fmtDate(a.created_at)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
