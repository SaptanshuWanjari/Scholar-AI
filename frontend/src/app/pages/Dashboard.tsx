import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Layers,
  ListChecks,
  Clock,
  Sparkles,
  Lightbulb,
  LibraryBig,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Page } from "../components/Page";
import PageLoading from "@/app/components/ui/PageLoading";
import { PaperButton } from "@paper-ui/components/buttons";
import {
  NotebookSpiralCard,
  SessionCard,
  StickyNoteCard,
  ContinueLearningCard,
} from "@paper-ui/components/cards";
import {
  PaperTable,
  TableHeader,
  TableRow,
  TableCell,
} from "@paper-ui/components/tables";
import { StatRow } from "@paper-ui/components/rows";
import { SunDoodle, ArrowDoodle } from "@paper-ui/components/doodles";
import { api, type DashboardData, type LearningPathMeta, type LearningPath } from "../lib/api";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { Course, DocumentItem } from "../lib/types";

type IconTone = "lavender" | "ochre" | "sky" | "sage" | "brick" | "ink";

interface StatSpec {
  label: string;
  value: number;
  sublabel: string;
  icon: LucideIcon;
  tone: IconTone;
  onClick?: () => void;
}

const DOC_ICON_TONES = ["text-ochre", "text-sage", "text-sky", "text-lavender"];

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [paths, setPaths] = useState<LearningPathMeta[]>([]);
  const [activePathDetails, setActivePathDetails] = useState<LearningPath | null>(null);
  const [pathsLoaded, setPathsLoaded] = useState(false);
  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let done = 0;
    const maybeDone = () => { done++; if (done >= 4) setLoading(false); };
    api.listCourses().then(setCourses).catch(() => { }).finally(maybeDone);
    api.listDocuments().then(setDocuments).catch(() => { }).finally(maybeDone);
    api.getDashboard().then(setDashboard).catch(() => { }).finally(maybeDone);
    api.listLearningPaths().then((res) => {
      setPaths(res);
      const active = res.find(p => !p.archived);
      if (active) {
        api.getLearningPath(active.id).then(setActivePathDetails).catch(() => {});
      }
      setPathsLoaded(true);
    }).catch(() => setPathsLoaded(true)).finally(maybeDone);
  }, []);

  const metrics = dashboard?.metrics;

  const stats: StatSpec[] = [
    {
      label: "Documents",
      value: metrics?.documents ?? documents.length,
      sublabel: `${courses.length} courses`,
      icon: FileText,
      tone: "lavender",
    },
    {
      label: "Cards due today",
      value: metrics?.flashcardsDue ?? 0,
      sublabel: "Review today",
      icon: Layers,
      tone: "ochre",
      onClick: () => navigate("/flashcards"),
    },
    {
      label: "Total Flashcards",
      value: metrics?.flashcards ?? 0,
      sublabel: "Across all decks",
      icon: LibraryBig,
      tone: "sky",
    },
    {
      label: "Quizzes taken",
      value: metrics?.quizzesTaken ?? 0,
      sublabel: "Total attempts",
      icon: ListChecks,
      tone: "sage",
    },
    {
      label: "Study sessions",
      value: metrics?.studySessions ?? 0,
      sublabel: "Recorded sessions",
      icon: Clock,
      tone: "brick",
    },
  ];

  const pathPercent = activePathDetails
    ? Math.round(
        (activePathDetails.progress.conceptsDone /
          Math.max(1, activePathDetails.progress.conceptsTotal)) *
          100,
      )
    : 0;

  const recentSessions =
    dashboard?.recentSessions?.map((s) => ({
      text: s.title,
      subtext: s.course,
      duration: s.duration,
      ago: s.date,
    })) ?? [];

  if (loading) return <PageLoading />;

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
          {!pathsLoaded ? null : activePathDetails ? (
            <ContinueLearningCard
              course={activePathDetails.title}
              percent={pathPercent}
              nextTitle={
                activePathDetails.nextRecommendation?.conceptTitle ?? "Review your topics"
              }
              nextNote={
                activePathDetails.nextRecommendation?.reason ?? "All caught up — review completed topics"
              }
              onViewAll={() => navigate("/learning-path")}
              onContinue={() => navigate(`/learning-path/${activePathDetails.id}`)}
            />
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
                  <th className="w-10" />
                </tr>
              </TableHeader>
              <tbody>
                {documents.slice(0, 4).map((d, i) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText
                          size={22}
                          strokeWidth={1.6}
                          className={`shrink-0 ${DOC_ICON_TONES[i % DOC_ICON_TONES.length]}`}
                        />
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
                    <TableCell align="right">
                      <button
                        onClick={() =>
                          setStarred((s) => ({ ...s, [d.id]: !s[d.id] }))
                        }
                        aria-label={starred[d.id] ? "Unstar" : "Star"}
                        className="font-architect text-[13px] text-ink-muted/70 hover:text-ink"
                      >
                        {starred[d.id] ? "★" : "☆"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {documents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
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

          {/* Stats — spiral notebook */}
          <NotebookSpiralCard title="Your Stats" spiralCount={9}>
            <div className="space-y-1">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className={s.onClick ? "cursor-pointer" : undefined}
                  onClick={s.onClick}
                >
                  <StatRow
                    label={s.label}
                    value={s.value}
                    sublabel={s.sublabel}
                    icon={<s.icon className="size-5" />}
                    tone={s.tone}
                  />
                </div>
              ))}
            </div>
          </NotebookSpiralCard>

          {/* Recent sessions — taped notebook card */}
          <SessionCard
            title="Recent sessions"
            sessions={recentSessions}
            onViewAll={() => navigate("/sessions")}
          />
        </div>
      </div>
    </Page>
  );
}
