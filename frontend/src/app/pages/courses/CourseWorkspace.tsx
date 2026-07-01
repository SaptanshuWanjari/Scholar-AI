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
import { api } from "../../lib/api";
import type {
  Course,
  CourseStats,
  ArtifactItem,
  DocumentItem,
} from "../../lib/types";
import { useCourseWorkspaceStore } from "../../stores/useCourseWorkspaceStore";
import { cn } from "@/paper-ui/utils";
import { PageTitle } from "@/paper-ui/components/utility";
import { Divider } from "@/paper-ui/components/utility";
import { Tabs } from "@/paper-ui/components/navigation";
import { PaperPanel } from "@/paper-ui/core";
import { ConfirmationDialog } from "@/paper-ui/components/dialogs";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
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

const TONE_MAP: Record<string, string> = {
  "#8b5cf6": "lavender",
  "#06b6d4": "sky",
  "#22c55e": "sage",
  "#f59e0b": "ochre",
  "#ec4899": "brick",
  "#14b8a6": "sage",
  "#0ea5e9": "sky",
  "#f97316": "ochre",
  "#a855f7": "lavender",
  "#64748b": "ink",
};

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
  const { activeTab, setActiveTab, artifactTypeFilter, setArtifactTypeFilter } =
    useCourseWorkspaceStore();
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
    } catch (e) {
      toast.error(String(e));
    }
    setLoadingStats(false);
  }, [course.id, course.name]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleDeleteDoc = async () => {
    if (!deletingDocId) return;
    try {
      await api.deleteDocument(deletingDocId);
      await loadAll();
    } catch { }
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
        action: {
          label: "Open",
          onClick: () => navigate(`/teach?package=${pkg.id}`),
        },
      });
    } catch {
      toast.error("Failed to generate course package");
    }
    setGeneratingPackage(false);
  };

  const STAT_CARDS = stats
    ? [
      { label: "Documents", value: stats.documents, icon: FileText },
      { label: "Flashcards", value: stats.flashcards, icon: Layers },
      { label: "Quizzes", value: stats.quizzes, icon: ListChecks },
      { label: "Notebooks", value: stats.notebooks, icon: Notebook },
      { label: "Diagrams", value: stats.diagrams, icon: Workflow },
      { label: "Mind Maps", value: stats.mindmaps, icon: Network },
      { label: "Whiteboards", value: stats.whiteboards, icon: PencilRuler },
      {
        label: "Differences",
        value: stats.difference_tables,
        icon: Columns2,
      },
      { label: "Revisions", value: stats.revisions, icon: NotebookPen },
      { label: "Concepts", value: stats.concepts, icon: Brain },
    ]
    : [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-paper">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <span
              className="relative inline-flex shrink-0 items-center justify-center"
              style={{ width: 48, height: 48, color: course.color }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ backgroundColor: `${course.color}20` }}
              />
              <span className="relative z-1 font-kalam text-sm font-bold">
                {course.code.split(" ")[0].slice(0, 2)}
              </span>
            </span>
            <div className="min-w-0">
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
                    className="font-caveat text-[34px] font-bold leading-[1.1] tracking-[-0.01em] text-ink bg-transparent border-0 border-b-2 border-ink/30 focus:border-ink focus:ring-0 outline-none px-0 py-0 min-w-50 transition-colors"
                    style={{ width: `${Math.max(editName.length, 5)}ch` }}
                  />
                </div>
              ) : (
                <h1 className="font-caveat text-[34px] font-bold leading-[1.1] tracking-[-0.01em] text-ink truncate">
                  {course.name}
                </h1>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-ink-muted">
                <span className="font-architect  text-ink-muted uppercase tracking-wider">
                  {course.code}
                </span>
                {stats && (
                  <>
                    <Divider
                      orientation="vertical"
                      className="h-5 opacity-45"
                      color="var(--paper-ink-muted)"
                    />
                    <span className="font-kalam  text-ink-muted">
                      {stats.documents} Documents
                    </span>
                    <Divider
                      orientation="vertical"
                      className="h-5 opacity-45"
                      color="var(--paper-ink-muted)"
                    />
                    <span className="font-kalam  text-ink-muted">
                      {stats.total_artifacts} Artifacts
                    </span>
                    {stats.last_updated && (
                      <>
                        <Divider
                          orientation="vertical"
                          className="h-5 opacity-45"
                          color="var(--paper-ink-muted)"
                        />
                        <span className="font-architect  text-ink-muted">
                          Updated {fmtDate(stats.last_updated)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isRenaming && (
              <GhostButton size="md" onClick={onRenameStart}>
                <Pencil className="size-3.5" /> Rename
              </GhostButton>
            )}
            <PaperButton
              size="md"
              tone="paper"
              onClick={handleReindex}
              disabled={reindexing}
            >
              <RefreshCw
                className={cn("size-3.5", reindexing && "animate-spin")}
              />
              {reindexing ? "Queuing\u2026" : "Rebuild Index"}
            </PaperButton>
            <PaperButton
              size="md"
              tone="paper"
              onClick={handleGeneratePackage}
              disabled={generatingPackage}
            >
              <Package
                className={cn("size-3.5", generatingPackage && "animate-pulse")}
              />
              {generatingPackage ? "Generating\u2026" : "Generate Package"}
            </PaperButton>
            <PaperButton tone="red" size="md" onClick={onDelete}>
              <Trash2 className="size-4.5" /> Delete
            </PaperButton>
          </div>
        </div>

        {/* Stats row */}
        {stats && (
          <div className=" py-5">
            <Divider
              orientation="horizontal"
              className="mb-2"
              color="#e4e0d6"
            />
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-5 gap-x-6 lg:gap-x-8">
              {STAT_CARDS.map((sc) => (
                <div
                  key={sc.label}
                  className="flex flex-col items-center gap-1.5 min-w-22.5"
                >
                  <span className="font-architect text-[11px] uppercase tracking-wider text-ink-muted font-medium">
                    {sc.label}
                  </span>
                  <span className="font-caveat text-[28px] leading-none text-ink">
                    {sc.value}
                  </span>
                </div>
              ))}
            </div>
            <Divider
              orientation="horizontal"
              className="mt-2"
              color="#e4e0d6"
            />
          </div>
        )}
        {loadingStats && !stats && (
          <div className="mt-6 h-20 rounded-xl bg-paper-panel animate-pulse" />
        )}

        {/* Tabs */}
        <Tabs
          className="mt-5"
          items={["overview", "documents", "artifacts", "settings"].map(
            (t) => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1) }),
          )}
          active={activeTab}
          onChange={(key) => setActiveTab(key as typeof activeTab)}
          markerColor="#4f4d7a"
        />
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
        {activeTab === "settings" && (
          <SettingsTab
            course={course}
            onUpdate={() => {
              loadAll();
            }}
          />
        )}
      </div>

      <ConfirmationDialog
        open={!!deletingDocId}
        onConfirm={handleDeleteDoc}
        onCancel={() => setDeletingDocId(null)}
        title="Delete this document?"
        message="This removes the document and its indexed data. Previously generated artifacts are not deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </div>
  );
}
