import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Pencil,
  RefreshCw,
  Package,
  Trash2,
  FileText,
  Layers,
  ListChecks,
  Notebook,
  Workflow,
  Network,
  PencilRuler,
  Columns2,
  NotebookPen,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type { Course, CourseStats, ArtifactItem, DocumentItem } from "../../lib/types";
import { useCourseWorkspaceStore } from "../../stores/useCourseWorkspaceStore";
import { cn } from "../../components/ui/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { fmtDate } from "./helpers";
import { OverviewTab } from "./OverviewTab";
import { DocumentsTab } from "./DocumentsTab";
import { ArtifactsTab } from "./ArtifactsTab";
import { SettingsTab } from "./SettingsTab";

interface CourseWorkspaceProps {
  course: Course;
  isRenaming: boolean;
  editName: string;
  setEditName: (v: string) => void;
  onRenameSubmit: () => void;
  onRenameCancel: () => void;
  onRenameStart: () => void;
  onDelete: () => void;
  navigate: ReturnType<typeof useNavigate>;
}

export function CourseWorkspace({
  course,
  isRenaming,
  editName,
  setEditName,
  onRenameSubmit,
  onRenameCancel,
  onRenameStart,
  onDelete,
  navigate,
}: CourseWorkspaceProps) {
  const { activeTab, setActiveTab, artifactTypeFilter, setArtifactTypeFilter } = useCourseWorkspaceStore();
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [artifacts, setArtifacts] = useState<ArtifactItem[]>([]);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [reindexing, setReindexing] = useState(false);
  const [generatingPackage, setGeneratingPackage] = useState(false);

  const loadAll = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [s, docs, arts] = await Promise.all([
        api.getCourseStats(course.id),
        api.listDocuments(course.name),
        api.getCourseArtifacts(course.id),
      ]);
      setStats(s);
      setDocuments(docs);
      setArtifacts(arts);
    } catch (e) { toast.error(String(e)); }
    setLoadingStats(false);
  }, [course.id, course.name]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleDeleteDoc = async () => {
    if (!deletingDocId) return;
    try { await api.deleteDocument(deletingDocId); await loadAll(); } catch {}
    setDeletingDocId(null);
  };

  const handleReindex = async () => {
    setReindexing(true);
    try {
      const job = await api.reindexCourse(course.id);
      toast.success(`Rebuilding index for ${course.name}`, {
        description: `Job queued (${job.id.slice(0, 8)}\u2026). Documents will be re-embedded in the background.`,
      });
    } catch {
      toast.error("Failed to start reindex");
    }
    setReindexing(false);
  };

  const handleGeneratePackage = async () => {
    setGeneratingPackage(true);
    try {
      const pkg = await api.generateCoursePackage(course.id);
      toast.success("Course package generated", {
        description: `"${pkg.title}" saved. Open Teach Me to view it.`,
        action: { label: "Open", onClick: () => navigate(`/teach?package=${pkg.id}`) },
      });
    } catch {
      toast.error("Failed to generate course package");
    }
    setGeneratingPackage(false);
  };

  const STAT_CARDS = stats ? [
    { label: "Documents", value: stats.documents, icon: FileText, color: "#8b5cf6" },
    { label: "Flashcards", value: stats.flashcards, icon: Layers, color: "#06b6d4" },
    { label: "Quizzes", value: stats.quizzes, icon: ListChecks, color: "#22c55e" },
    { label: "Notebooks", value: stats.notebooks, icon: Notebook, color: "#f59e0b" },
    { label: "Diagrams", value: stats.diagrams, icon: Workflow, color: "#ec4899" },
    { label: "Mind Maps", value: stats.mindmaps, icon: Network, color: "#14b8a6" },
    { label: "Whiteboards", value: stats.whiteboards, icon: PencilRuler, color: "#0ea5e9" },
    { label: "Differences", value: stats.difference_tables, icon: Columns2, color: "#f97316" },
    { label: "Revisions", value: stats.revisions, icon: NotebookPen, color: "#a855f7" },
    { label: "Concepts", value: stats.concepts, icon: Brain, color: "#64748b" },
  ] : [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-border shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="size-12 rounded-2xl flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${course.color}20`, color: course.color }}
            >
              {course.code.split(" ")[0].slice(0, 2)}
            </div>
            <div>
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onRenameSubmit();
                      if (e.key === "Escape") onRenameCancel();
                    }}
                    onBlur={onRenameSubmit}
                    autoFocus
                    spellCheck={false}
                    className="text-2xl font-bold tracking-tight bg-transparent border-0 border-b-2 border-primary/30 focus:border-primary focus:ring-0 outline-none px-0 py-0 min-w-[200px] transition-colors"
                    style={{ width: `${Math.max(editName.length, 5)}ch` }}
                  />
                </div>
              ) : (
                <h1 className="text-2xl font-bold tracking-tight">{course.name}</h1>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="uppercase tracking-wider text-[11px]">{course.code}</span>
                {stats && (
                  <>
                    <span className="opacity-40">·</span>
                    <span>{stats.documents} Documents</span>
                    <span className="opacity-40">·</span>
                    <span>{stats.total_artifacts} Artifacts</span>
                    {stats.last_updated && (
                      <>
                        <span className="opacity-40">·</span>
                        <span>Updated {fmtDate(stats.last_updated)}</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isRenaming && (
              <Button size="sm" variant="ghost" onClick={onRenameStart}>
                <Pencil className="size-3.5 mr-1.5" /> Rename
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleReindex} disabled={reindexing}>
              <RefreshCw className={cn("size-3.5 mr-1.5", reindexing && "animate-spin")} />
              {reindexing ? "Queuing\u2026" : "Rebuild Index"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleGeneratePackage} disabled={generatingPackage}>
              <Package className={cn("size-3.5 mr-1.5", generatingPackage && "animate-pulse")} />
              {generatingPackage ? "Generating\u2026" : "Generate Package"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              onClick={onDelete}
            >
              <Trash2 className="size-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>

        {stats && (
          <div className="mt-8 border-y border-border py-5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-6 gap-x-6 px-2 lg:gap-x-8">
              {STAT_CARDS.map((sc) => (
                <div key={sc.label} className="flex flex-col items-center gap-2 min-w-[90px]">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5 whitespace-nowrap">
                    <sc.icon className="size-3" style={{ color: sc.color }} /> {sc.label}
                  </span>
                  <span className="text-2xl font-display leading-none text-foreground">{sc.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {loadingStats && !stats && (
          <div className="mt-6 h-20 rounded-xl bg-muted/40 animate-pulse" />
        )}

        <div className="flex gap-1 mt-6">
          {(["overview", "documents", "artifacts", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                activeTab === tab
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            course={course}
            documents={documents}
            artifacts={artifacts}
            navigate={navigate}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            documents={documents}
            onDelete={(id) => setDeletingDocId(id)}
            navigate={navigate}
          />
        )}
        {activeTab === "artifacts" && (
          <ArtifactsTab
            artifacts={artifacts}
            typeFilter={artifactTypeFilter}
            setTypeFilter={setArtifactTypeFilter}
            navigate={navigate}
            courseName={course.name}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            course={course}
            onUpdate={() => {
              // The API updates the backend; optionally we can reload course info 
              // here, but the parent components might manage `course` state.
              // For now, it will update when unmounted/remounted.
              loadAll();
            }}
          />
        )}
      </div>

      <AlertDialog open={!!deletingDocId} onOpenChange={(open) => !open && setDeletingDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the document and its indexed data. Previously generated artifacts are not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDoc}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
