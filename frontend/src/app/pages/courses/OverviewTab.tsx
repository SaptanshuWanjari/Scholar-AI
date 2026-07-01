import { FolderOpen, Plus, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { Course, DocumentItem, ArtifactItem } from "../../lib/types";
import { cn } from "@/paper-ui/utils";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { Divider } from "@/paper-ui/components/utility";
import { fmtDate, ARTIFACT_ICON, ARTIFACT_LABEL } from "./helpers";
import {
  PaperTable,
  PaperTd,
  PaperTh,
  TableHeader,
  TableRow,
} from "@paper-ui/components";

interface OverviewTabProps {
  course: Course;
  documents: DocumentItem[];
  artifacts: ArtifactItem[];
  navigate: ReturnType<typeof useNavigate>;
  setActiveTab: (t: "overview" | "documents" | "artifacts") => void;
}

export function OverviewTab({
  course,
  documents,
  artifacts,
  navigate,
  setActiveTab,
}: OverviewTabProps) {
  const recentDocs = documents.slice(0, 5);
  const recentArtifacts = artifacts.slice(0, 5);

  if (documents.length === 0 && artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-paper-panel flex items-center justify-center mb-4">
          <FolderOpen className="size-8 text-ink-muted" />
        </div>
        <h3 className="font-kalam text-lg font-bold text-ink">
          No content yet
        </h3>
        <p className="font-architect text-sm text-ink-muted mt-1 max-w-sm">
          Upload documents to this course, then generate study artifacts from
          them.
        </p>
        <PaperButton
          size="sm"
          tone="dark"
          className="mt-6"
          onClick={() => navigate("/documents")}
        >
          <Plus className="size-4" /> Upload Documents
        </PaperButton>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-architect text-sm uppercase tracking-wider text-ink-muted font-medium">
            Recent Documents
          </span>
          <GhostButton size="md" className='text-sm' onClick={() => setActiveTab("documents")}>
            View all <ArrowRight className="size-3" />
          </GhostButton>
        </div>
        <PaperTable>
          <TableHeader>
            <tr>
              <PaperTh>Document</PaperTh>
              <PaperTh className="w-20">Indexed</PaperTh>
            </tr>
          </TableHeader>
          <tbody className="divide-y divide-[#e8e3d8]">
            {recentDocs.map((d, i) => (
              <TableRow key={d.id} index={i}>
                <PaperTd>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-paper-panel flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-ink-muted" />
                    </div>
                    <span className="truncate max-w-xs font-kalam text-[14px] text-ink">
                      {d.title}
                    </span>
                  </div>
                </PaperTd>
                <PaperTd className="font-architect text-[13px] text-ink-muted">
                  {fmtDate(d.addedAt)}
                </PaperTd>
              </TableRow>
            ))}
          </tbody>
        </PaperTable>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="font-architect text-sm uppercase tracking-wider text-ink-muted font-medium">
            Recent Artifacts
          </span>
          <GhostButton size="md" className="text-sm" onClick={() => setActiveTab("artifacts")}>
            View all <ArrowRight className="size-3" />
          </GhostButton>
        </div>
        <PaperTable>
          <TableHeader>
            <tr>
              <PaperTh>Artifact</PaperTh>
              <PaperTh className="w-24">Type</PaperTh>
            </tr>
          </TableHeader>
          <tbody className="divide-y divide-[#e8e3d8]">
            {recentArtifacts.map((a, i) => {
              const Icon = ARTIFACT_ICON[a.type] ?? FileText;
              return (
                <TableRow key={`${a.type}-${a.id}`} index={i}>
                  <PaperTd>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-paper-panel flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-ink-muted" />
                      </div>
                      <span className="truncate max-w-xs font-kalam text-[14px] text-ink">
                        {a.title}
                      </span>
                    </div>
                  </PaperTd>
                  <PaperTd className="font-architect text-[13px] text-ink-muted">
                    {ARTIFACT_LABEL[a.type] ?? a.type}
                  </PaperTd>
                </TableRow>
              );
            })}
          </tbody>
        </PaperTable>
      </div>
    </div>
  );
}
