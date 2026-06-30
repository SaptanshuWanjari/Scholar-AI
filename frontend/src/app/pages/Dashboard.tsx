import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Layers,
  ListChecks,
  Clock,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Archive,
  Bookmark,
  Network,
  PenTool,
  FileQuestion,
  Repeat,
  LibraryBig,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Page } from "../components/Page";
import { PaperButton } from "@paper-ui/components/buttons";
import { NotebookSpiralCard } from "@paper-ui/components/cards/NotebookSpiralCard";
import { PaperSheetCard } from "@paper-ui/components/cards/PaperSheetCard";
import { PinnedCard } from "@paper-ui/components/cards/PinnedCard";
import { StickyNoteCard } from "@paper-ui/components/cards/StickyNoteCard";
import { MetricCard } from "@paper-ui/components/cards/MetricCard";
import { PaperTable } from "@paper-ui/components/tables/PaperTable";
import { TableHeader } from "@paper-ui/components/tables/TableHeader";
import { TableRow } from "@paper-ui/components/tables/TableRow";
import { TableCell } from "@paper-ui/components/tables/TableCell";
import { SessionRow } from "@paper-ui/components/rows/SessionRow";
import { SunDoodle, SignpostDoodle, ArrowDoodle } from "@paper-ui/components/doodles";
import { api, type DashboardData, type LearningPathMeta, type LearningPath } from "../lib/api";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { Course, DocumentItem } from "../lib/types";

type IconTone = "lavender" | "ochre" | "sky" | "sage" | "brick" | "ink";

interface StatSpec {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone: IconTone;
  onClick?: () => void;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { name } = useSettingsStore();
  const userName = name || "Student";
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  };

  const getArtifactIcon = (type: string): LucideIcon => {
    switch (type) {
      case "quiz": return ListChecks;
      case "revision": return FileText;
      case "diagram":
      case "mindmap": return Network;
      case "whiteboard": return PenTool;
      default: return Sparkles;
    }
  };

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [paths, setPaths] = useState<LearningPathMeta[]>([]);
  const [activePathDetails, setActivePathDetails] = useState<LearningPath | null>(null);

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => { });
    api.listDocuments().then(setDocuments).catch(() => { });
    api.getDashboard().then(setDashboard).catch(() => { });
    api.listLearningPaths().then((res) => {
      setPaths(res);
      const active = res.find(p => !p.archived);
      if (active) {
        api.getLearningPath(active.id).then(setActivePathDetails).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const metrics = dashboard?.metrics;
  const archivedPaths = paths.filter(p => p.archived);

  const stats: StatSpec[] = [
    {
      label: "Documents",
      value: metrics?.documents ?? documents.length,
      description: `${courses.length} courses`,
      icon: FileText,
      tone: "lavender",
    },
    {
      label: "Cards due today",
      value: metrics?.flashcardsDue ?? 0,
      description: "Review today",
      icon: Layers,
      tone: "ochre",
      onClick: () => navigate("/flashcards"),
    },
    {
      label: "Total Flashcards",
      value: metrics?.flashcards ?? 0,
      description: "Across all decks",
      icon: LibraryBig,
      tone: "sky",
    },
    {
      label: "Quizzes taken",
      value: metrics?.quizzesTaken ?? 0,
      description: "Total attempts",
      icon: ListChecks,
      tone: "sage",
    },
    {
      label: "Study sessions",
      value: metrics?.studySessions ?? 0,
      description: "Recorded sessions",
      icon: Clock,
      tone: "brick",
    },
  ];

  return (
    <Page className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-6"
      >
        <div className="flex items-center gap-3">
          <SunDoodle size={46} className="-mt-1 text-ink" />
          <h1 className="font-caveat text-[2.75rem] font-bold leading-none text-ink">
            {getGreeting()}, {userName}.
          </h1>
        </div>
        <div className="flex gap-2" data-tour="dashboard-actions">
          <PaperButton tone="dark" onClick={() => navigate("/ask")} className="gap-2">
            <Sparkles className="size-4" /> Ask AI
          </PaperButton>
          <PaperButton tone="paper" onClick={() => navigate("/teach")} className="gap-2">
            <Lightbulb size={16} /> Teach Me
          </PaperButton>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column (Primary Focus) */}
        <div className="space-y-6 lg:col-span-2">

          {/* Active Learning Path */}
          {activePathDetails ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NotebookSpiralCard
                title="Continue Learning"
                spiralCount={12}
                className="rounded-2xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-architect text-[12px] uppercase tracking-[0.18em] text-ink/55">
                      {activePathDetails.title}
                    </p>
                    <p className="mt-1 font-kalam text-[15px] text-ink-muted">
                      {Math.round(
                        (activePathDetails.progress.conceptsDone /
                          Math.max(1, activePathDetails.progress.conceptsTotal)) *
                          100,
                      )}
                      % completed
                    </p>
                  </div>
                  <SignpostDoodle size={42} color="#3a3733" />
                </div>

                {activePathDetails.nextRecommendation ? (
                  <div className="mb-5 rounded-md border border-ink/15 bg-white/40 px-4 py-3">
                    <p className="font-architect text-[11px] uppercase tracking-wider text-ink/55">
                      Next up
                    </p>
                    <p className="mt-1 font-caveat text-[20px] font-bold text-ink">
                      {activePathDetails.nextRecommendation.conceptTitle}
                    </p>
                    <p className="mt-0.5 font-kalam text-[13px] text-ink-muted">
                      {activePathDetails.nextRecommendation.reason}
                    </p>
                  </div>
                ) : (
                  <div className="mb-5 rounded-md border border-ink/15 bg-white/40 px-4 py-3">
                    <p className="font-kalam text-[14px] text-ink-muted">
                      You are all caught up! Review your completed topics.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <PaperButton
                    tone="paper"
                    size="sm"
                    onClick={() => navigate("/learning-path")}
                  >
                    View All Paths
                  </PaperButton>
                  <PaperButton
                    tone="dark"
                    size="sm"
                    onClick={() => navigate(`/learning-path/${activePathDetails.id}`)}
                    className="gap-2"
                  >
                    Continue <ArrowDoodle size={15} />
                  </PaperButton>
                </div>
              </NotebookSpiralCard>
            </motion.div>
          ) : (
            <StickyNoteCard color="yellow" title="No active learning path">
              <p className="font-kalam text-[15px]">
                Generate a personalized learning path from your documents to get a
                structured study roadmap.
              </p>
              <div className="mt-4">
                <PaperButton
                  tone="dark"
                  size="sm"
                  onClick={() => navigate("/learning-path")}
                  className="gap-2"
                >
                  <Sparkles className="size-4" /> Generate Path
                </PaperButton>
              </div>
            </StickyNoteCard>
          )}

          {/* Recent documents */}
          <div data-tour="dashboard-recent">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-caveat text-[28px] font-bold text-ink">
                Recent documents
              </h2>
              <button
                onClick={() => navigate("/documents")}
                className="inline-flex items-center gap-1.5 font-architect text-[13px] text-ink/70 transition-colors hover:text-ink"
              >
                View all <ArrowDoodle size={14} />
              </button>
            </div>

            <PaperTable>
              <TableHeader>
                <tr>
                  <th className="font-architect text-[12px] uppercase tracking-wider text-ink-muted text-left px-4 py-3">
                    Document
                  </th>
                  <th className="font-architect text-[12px] uppercase tracking-wider text-ink-muted text-left px-4 py-3">
                    Course
                  </th>
                  <th className="font-architect text-[12px] uppercase tracking-wider text-ink-muted text-right px-4 py-3">
                    Added
                  </th>
                </tr>
              </TableHeader>
              <tbody>
                {documents.slice(0, 4).map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText size={20} strokeWidth={1.6} className="shrink-0 text-ink-muted" />
                        <span className="truncate font-kalam text-[15px] font-bold text-ink">
                          {d.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell muted>
                      <span className="font-kalam text-[14px]">
                        {d.course} · {d.pages}p
                      </span>
                    </TableCell>
                    <TableCell align="right" muted>
                      <span className="font-architect text-[13px]">{d.addedAt}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {documents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <p className="px-4 py-8 text-center font-kalam text-[14px] text-ink-muted">
                        No documents found.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </PaperTable>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Archived Paths */}
          {archivedPaths.length > 0 && (
            <PinnedCard title="Archived Paths" pinStyle="push-pin" rotate={-0.5}>
              <div className="space-y-2">
                {archivedPaths.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-black/[0.025] cursor-pointer"
                    onClick={() => navigate(`/learning-path/${p.id}`)}
                  >
                    <Archive size={16} className="shrink-0 text-ink-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-kalam text-[14px] font-bold text-ink">
                        {p.title}
                      </p>
                      <p className="truncate font-kalam text-[12px] text-ink-muted">
                        {p.course}
                      </p>
                    </div>
                    <CheckCircle2 size={16} className="text-[#3f7a4e]" />
                  </div>
                ))}
              </div>
              {archivedPaths.length > 3 && (
                <PaperButton
                  tone="paper"
                  size="sm"
                  className="w-full mt-3 text-xs"
                  onClick={() => navigate("/learning-path")}
                >
                  View all archives
                </PaperButton>
              )}
            </PinnedCard>
          )}

          {/* Stats — spiral notebook */}
          <NotebookSpiralCard title="Your Stats" spiralCount={9}>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={s.onClick ? "cursor-pointer" : undefined}
                  onClick={s.onClick}
                >
                  <MetricCard
                    label={s.label}
                    value={s.value}
                    description={s.description}
                    icon={<s.icon className="size-4" />}
                    tone={s.tone}
                  />
                </div>
              ))}
            </div>
          </NotebookSpiralCard>

          {/* Recent sessions — taped notebook sheet */}
          <PaperSheetCard title="Recent sessions">
            {dashboard?.recentSessions?.length ? (
              <div className="space-y-3">
                {dashboard.recentSessions.map((s) => (
                  <div key={s.id} className="-mx-2">
                    <SessionRow
                      text={s.title}
                      subtext={s.course}
                      duration={s.duration}
                      ago={s.date}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center font-kalam text-[13px] text-ink-muted">
                No sessions yet
              </p>
            )}
          </PaperSheetCard>

          {/* Recently generated — sticky notes */}
          {dashboard?.recentArtifacts?.length ? (
            <StickyNoteCard color="blue" title="Recently generated" pin="tape" rotate={-1}>
              <div className="space-y-1">
                {dashboard.recentArtifacts.slice(0, 4).map((a) => {
                  const Icon = getArtifactIcon(a.type);
                  return (
                    <div
                      key={`${a.type}-${a.id}`}
                      className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-black/[0.04] cursor-pointer"
                      onClick={() => navigate(a.url)}
                    >
                      <Icon size={16} className="shrink-0 text-ink" />
                      <div className="min-w-0 flex-1 leading-tight">
                        <p className="truncate font-kalam text-[14px] font-bold text-ink">
                          {a.title}
                        </p>
                        <p className="truncate font-kalam text-[11px] text-ink/60 capitalize">
                          {a.type} · {a.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </StickyNoteCard>
          ) : null}

          {/* Recent bookmarks — pinned card */}
          <PinnedCard title="Recent bookmarks" pinStyle="tape" rotate={0.5}>
            <div className="space-y-2">
              {dashboard?.recentBookmarks?.length ? (
                dashboard.recentBookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-black/[0.025] cursor-pointer"
                    onClick={() => navigate(`/reading?doc=${bm.docId}`)}
                  >
                    <Bookmark size={16} className="shrink-0 text-[#c9954f]" />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate font-kalam text-[14px] font-bold text-ink">
                        {bm.section || "Untitled section"}
                      </p>
                      <p className="truncate font-kalam text-[12px] text-ink-muted">
                        {bm.note || "No note"} · {bm.docTitle}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center font-kalam text-[12px] text-ink-muted">
                  No recent bookmarks
                </p>
              )}
            </div>
          </PinnedCard>

          {/* Quick actions — sticky note cluster */}
          <StickyNoteCard color="green" title="Quick practice" pin="none" rotate={1}>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => navigate("/quiz")}
                className="flex items-center gap-2 rounded-md border border-ink/15 bg-white/30 px-3 py-2 font-architect text-[12px] text-ink hover:bg-white/50"
              >
                <FileQuestion size={14} /> Quiz
              </button>
              <button
                onClick={() => navigate("/revision")}
                className="flex items-center gap-2 rounded-md border border-ink/15 bg-white/30 px-3 py-2 font-architect text-[12px] text-ink hover:bg-white/50"
              >
                <Repeat size={14} /> Revise
              </button>
            </div>
          </StickyNoteCard>
        </div>
      </div>
    </Page>
  );
}
