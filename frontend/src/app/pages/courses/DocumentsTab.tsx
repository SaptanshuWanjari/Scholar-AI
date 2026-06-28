import { FileText, Plus, Trash2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import type { DocumentItem } from "../../lib/types";
import { cn } from "../../components/ui/utils";
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
        <div className="size-14 rounded-full bg-accent flex items-center justify-center mb-4">
          <FileText className="size-7 text-muted-foreground" />
        </div>
        <h3 className="font-medium">No documents in this course</h3>
        <p className="text-sm text-muted-foreground mt-1">Upload documents to start generating study materials.</p>
        <Button className="mt-5" onClick={() => navigate("/documents")}>
          <Plus className="size-4 mr-2" /> Upload Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Document</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-20">Pages</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-24">Status</th>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground font-medium w-28">Indexed</th>
            <th className="px-4 py-3 w-24"></th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {documents.map((d) => (
            <tr key={d.id} className="hover:bg-accent/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-muted-foreground" />
                  </div>
                  <span className="truncate max-w-xs font-medium">{d.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{d.pages}</td>
              <td className="px-4 py-3">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                  d.status === "indexed" ? "bg-green-500/10 text-green-600" :
                  d.status === "processing" ? "bg-yellow-500/10 text-yellow-600" :
                  "bg-red-500/10 text-red-600"
                )}>
                  {d.status}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-xs">{fmtDate(d.addedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={() => navigate("/reading")}
                  >
                    <BookOpen className="size-3 mr-1" /> Open
                  </Button>
                  <button
                    onClick={() => onDelete(d.id)}
                    className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
