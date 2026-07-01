import { FileText, Plus, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import type { DocumentItem } from "../../lib/types";
import { cn } from "@/paper-ui/utils";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperTable, TableHeader, PaperTh, TableRow, PaperTd, EmptyTable } from "@/paper-ui/components/tables";
import { StatusBadge } from "@/paper-ui/components/badges";
import { fmtDate } from "./helpers";

interface DocumentsTabProps {
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}

export function DocumentsTab({ documents, onDelete, navigate }: DocumentsTabProps) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="size-14 rounded-full bg-paper-panel flex items-center justify-center mb-4">
          <FileText className="size-7 text-ink-muted" />
        </div>
        <h3 className="font-kalam text-lg font-bold text-ink">No documents in this course</h3>
        <p className="font-architect text-sm text-ink-muted mt-1">Upload documents to start generating study materials.</p>
        <PaperButton size="sm" tone="dark" className="mt-5" onClick={() => navigate("/documents")}>
          <Plus className="size-4" /> Upload Documents
        </PaperButton>
      </div>
    );
  }

  return (
    <PaperTable>
      <TableHeader>
        <tr>
          <PaperTh>Document</PaperTh>
          <PaperTh className="w-20">Pages</PaperTh>
          <PaperTh className="w-24">Status</PaperTh>
          <PaperTh className="w-28">Indexed</PaperTh>
          <PaperTh className="w-24"></PaperTh>
        </tr>
      </TableHeader>
      <tbody className="divide-y divide-[#e8e3d8]">
        {documents.map((d, i) => (
          <TableRow key={d.id} index={i}>
            <PaperTd>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-paper-panel flex items-center justify-center shrink-0">
                  <FileText className="size-4 text-ink-muted" />
                </div>
                <span className="truncate max-w-xs font-kalam text-[14px] text-ink">{d.title}</span>
              </div>
            </PaperTd>
            <PaperTd className="font-architect text-[13px] text-ink-muted">{d.pages}</PaperTd>
            <PaperTd><StatusBadge status={d.status as "indexed" | "processing" | "failed"} /></PaperTd>
            <PaperTd className="font-architect text-[13px] text-ink-muted">{fmtDate(d.addedAt)}</PaperTd>
            <PaperTd>
              <div className="flex items-center gap-1 justify-end">
                <GhostButton size="sm" className="h-7 px-2 text-xs" onClick={() => navigate("/reading")}>
                  <BookOpen className="size-3" /> Open
                </GhostButton>
                <button onClick={() => onDelete(d.id)}
                  className="size-7 flex items-center justify-center rounded-md hover:bg-brick-soft text-ink-muted hover:text-brick transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </PaperTd>
          </TableRow>
        ))}
      </tbody>
    </PaperTable>
  );
}
