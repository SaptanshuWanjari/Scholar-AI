import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  FolderOpen,
  Plus,
  Search,
  Trash2,
  Pencil,
  Check,
  X,
  FileText,
  Layers,
  ListChecks,
  Notebook,
  Workflow,
  Network,
  Columns2,
  NotebookPen,
  PencilRuler,
  Brain,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import type { Course, CourseStats, ArtifactItem, DocumentItem } from "../lib/types";
import { useCourseWorkspaceStore } from "../stores/useCourseWorkspaceStore";
import { cn } from "../components/ui/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const ARTIFACT_LABEL: Record<string, string> = {
  deck: "Flashcard Deck",
  quiz: "Quiz",
  notebook: "Notebook",
  diagram: "Diagram",
  mindmap: "Mind Map",
  whiteboard: "Whiteboard",
  difference_table: "Difference Table",
  revision: "Revision Sheet",
};

const ARTIFACT_ROUTE: Record<string, string> = {
  deck: "/flashcards",
  quiz: "/quiz",
  notebook: "/notebooks",
  diagram: "/diagrams",
  mindmap: "/mindmaps",
  whiteboard: "/whiteboards",
  difference_table: "/differences",
  revision: "/revision",
};

const ARTIFACT_ICON: Record<string, typeof FileText> = {
  deck: Layers,
  quiz: ListChecks,
  notebook: Notebook,
  diagram: Workflow,
  mindmap: Network,
  whiteboard: PencilRuler,
  difference_table: Columns2,
  revision: NotebookPen,
};

// ── Left Panel ────────────────────────────────────────────────────────────────

interface CourseRowProps {
  course: Course;
  isSelected: boolean;
  onSelect: () => void;
  onRename: () => void;
  onDelete: () => void;
}

function CourseRow({ course, isSelected, onSelect, onRename, onDelete }: CourseRowProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group w-full text-left px-3 py-3 rounded-xl transition-colors flex items-center gap-3",
        isSelected
          ? "bg-sidebar-accent text-foreground"
          : "hover:bg-sidebar-accent/60 text-sidebar-foreground",
      )}
    >
      {isSelected && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-violet" />
      )}
      <div
        className="size-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
        style={{ backgroundColor: `${course.color}20`, color: course.color }}
      >
        {course.code.split(" ")[0].slice(0, 2)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium leading-snug">{course.name}</div>
        <div className="flex gap-2 text-[11px] text-muted-foreground mt-0.5">
          <span>{course.documents} docs</span>
          <span className="opacity-40">·</span>
          <span>{course.flashcards} cards</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); onRename(); }}
          className="size-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground"
        >
          <Pencil className="size-3" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="size-6 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3" />
        </button>
      </div>
    </button>
  );
}


// ── Overview tab ──────────────────────────────────────────────────────────────

interface OverviewTabProps {
  course: Course;
  documents: DocumentItem[];
  artifacts: ArtifactItem[];
  navigate: ReturnType<typeof useNavigate>;
  setActiveTab: (t: "overview" | "documents" | "artifacts") => void;
}

function OverviewTab({ course, documents, artifacts, navigate, setActiveTab }: OverviewTabProps) {
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

// ── Documents tab ─────────────────────────────────────────────────────────────

interface DocumentsTabProps {
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  navigate: ReturnType<typeof useNavigate>;
}

function DocumentsTab({ documents, onDelete, navigate }: DocumentsTabProps) {
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

// ── Artifacts tab ─────────────────────────────────────────────────────────────

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

function ArtifactsTab({ artifacts, typeFilter, setTypeFilter, navigate, courseName }: ArtifactsTabProps) {
  const visible = typeFilter ? artifacts.filter((a) => a.type === typeFilter) : artifacts;

  return (
    <div className="space-y-4">
      {/* Filter chips */}
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

// ── Course Workspace (right panel) ────────────────────────────────────────────

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

function CourseWorkspace({
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
        description: `Job queued (${job.id.slice(0, 8)}…). Documents will be re-embedded in the background.`,
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
      {/* Header */}
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
              {reindexing ? "Queuing…" : "Rebuild Index"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleGeneratePackage} disabled={generatingPackage}>
              <Package className={cn("size-3.5 mr-1.5", generatingPackage && "animate-pulse")} />
              {generatingPackage ? "Generating…" : "Generate Package"}
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

        {/* Stats row */}
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

        {/* Tabs */}
        <div className="flex gap-1 mt-6">
          {(["overview", "documents", "artifacts"] as const).map((tab) => (
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

      {/* Tab content */}
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

// ── Main page ─────────────────────────────────────────────────────────────────

export function Courses() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCourseId, setSelectedCourse } = useCourseWorkspaceStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadCourses = useCallback(() =>
    api.listCourses().then(setCourses).catch(() => {}), []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  // Sync URL param → store on mount
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== selectedCourseId) setSelectedCourse(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve ?name= param (set by Teach "Back to course") after courses load
  useEffect(() => {
    const name = searchParams.get("name");
    if (!name || courses.length === 0) return;
    const match = courses.find((c) => c.name === decodeURIComponent(name));
    if (match) {
      setSelectedCourse(match.id);
      setSearchParams({ id: match.id }, { replace: true });
    }
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectCourse = (id: string) => {
    setSelectedCourse(id);
    setSearchParams({ id });
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) ?? null;

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newCourseName.trim()) return;
    try {
      const c = await api.createCourse(newCourseName);
      setNewCourseName("");
      setCreating(false);
      await loadCourses();
      selectCourse(c.id);
    } catch (e) { toast.error(String(e)); }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await api.updateCourse(id, editName);
      setEditingId(null);
      loadCourses();
    } catch (e) { toast.error(String(e)); }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.deleteCourse(deletingId);
      if (selectedCourseId === deletingId) {
        setSelectedCourse(null);
        setSearchParams({});
      }
      loadCourses();
    } catch (e) { toast.error(String(e)); }
    setDeletingId(null);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left panel ── */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-sidebar overflow-hidden">
        {/* Search + New */}
        <div className="px-3 pt-4 pb-2 space-y-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm bg-card border-border"
            />
          </div>
          <Button size="sm" className="w-full gap-1.5" onClick={() => setCreating(true)}>
            <Plus className="size-3.5" /> New Course
          </Button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="mx-3 mb-2 rounded-xl border border-violet/30 bg-violet-soft/20 p-3 space-y-2 shrink-0">
            <Input
              placeholder="Course name…"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              autoFocus
              className="h-8 text-sm bg-card border-border"
            />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleCreate} disabled={!newCourseName.trim()}>
                Create
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCreating(false)}>
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Course list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {filtered.length === 0 && !creating && (
            <div className="text-center py-10">
              <FolderOpen className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No courses found</p>
            </div>
          )}
          {filtered.map((c) => (
            <div key={c.id} className="relative">
              <CourseRow
                course={c}
                isSelected={selectedCourseId === c.id}
                onSelect={() => selectCourse(c.id)}
                onRename={() => { setEditingId(c.id); setEditName(c.name); }}
                onDelete={() => setDeletingId(c.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 overflow-hidden bg-background">
        {!selectedCourse ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="size-20 rounded-full bg-accent flex items-center justify-center mb-5">
              <FolderOpen className="size-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Select a Course</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              Choose a course from the left panel to manage its documents and generated artifacts.
            </p>
          </div>
        ) : (
          <CourseWorkspace
            key={selectedCourse.id}
            course={selectedCourse}
            isRenaming={editingId === selectedCourse.id}
            editName={editName}
            setEditName={setEditName}
            onRenameSubmit={() => handleUpdate(selectedCourse.id)}
            onRenameCancel={() => setEditingId(null)}
            onRenameStart={() => { setEditingId(selectedCourse.id); setEditName(selectedCourse.name); }}
            onDelete={() => setDeletingId(selectedCourse.id)}
            navigate={navigate}
          />
        )}
      </div>

      {/* Delete dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the course and all its documents. Generated artifacts stored in their
              respective pages are not deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
