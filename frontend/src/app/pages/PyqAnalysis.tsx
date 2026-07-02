import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  RefreshCw,
  GraduationCap,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  ListChecks,
  NotebookPen,
  Search,
  AlertTriangle,
  Trash2,
  BookOpen,
  FileSearch,
  Columns2,
  Pencil,
  Save,
  Share2,
  X,
} from "lucide-react";
import { toast } from "@/app/lib/toast";

// paper-ui replacements
import { Container } from "@/paper-ui/components/layout/Container";
import { MetricCard as PaperMetricCard } from "@/paper-ui/components/cards";
import { PaperButton, GhostButton } from "@/paper-ui/components/buttons";
import { PaperBadge } from "@/paper-ui/components/badges/PaperBadge";
import { PaperInput, PaperTextarea } from "@/paper-ui/components/inputs/PaperInput";
import { PaperSelect } from "@/paper-ui/components/inputs/PaperSelect";
import { PaperDrawer } from "@/paper-ui/components/dialogs/PaperDrawer";
import { PaperSheetCard, PaperH1 } from "@/paper-ui/core";
import { UploadZone } from "../components/UploadZone";
import { api } from "../lib/api";
import type { PyqQuestion, PyqTopicFreq } from "../lib/api";
import type { Course } from "../lib/types";
import { usePyqStore } from "../stores/usePyqStore";
import { useExamStore } from "../stores/useExamStore";
import { useQuizStore } from "../stores/useQuizStore";
import { useRevisionStore } from "../stores/useRevisionStore";

const ACCENT = "#4f4d7a";

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Increasing") return <TrendingUp className="size-3.5 text-success" />;
  if (trend === "Decreasing") return <TrendingDown className="size-3.5 text-danger" />;
  return <Minus className="size-3.5 text-muted-foreground" />;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-warning" title={`${n}/5`}>
      {"★".repeat(n)}
      <span className="text-muted-foreground/30">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

function Accuracy({ value }: { value: number | null }) {
  if (value == null)
    return <span className="text-xs text-muted-foreground/60">Not practiced</span>;
  const tone = value >= 75 ? "text-success" : value >= 50 ? "text-warning" : "text-danger";
  return <span className={`font-medium ${tone}`}>{value}%</span>;
}

export function PyqAnalysis() {
  const navigate = useNavigate();
  const course = usePyqStore((s) => s.course);
  const analysis = usePyqStore((s) => s.analysis);
  const papers = usePyqStore((s) => s.papers);
  const loading = usePyqStore((s) => s.loading);
  const selectCourse = usePyqStore((s) => s.selectCourse);
  const refresh = usePyqStore((s) => s.refresh);
  const setField = usePyqStore((s) => s.setField);
  const syncToKG = usePyqStore((s) => s.syncToKG);

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    let active = true;
    api.listCourses().then((cs) => {
      if (!active) return;
      setCourses(cs);
      if (cs.length && !course) selectCourse(cs[0].name);
    }).catch(() => {});
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Generate-asset helpers (seed the target store, then navigate) ----
  const seedExam = () => {
    if (!analysis) return;
    const top = analysis.topicFrequency.slice(0, 5).map((t) => t.topic).join(", ");
    useExamStore.getState().reset();
    useExamStore.getState().setField("topic", top || course);
    useExamStore.getState().setField("course", course);
    useExamStore.getState().setField("pyqCourse", course);
    useExamStore.getState().setField("difficulty", analysis.summary.avgDifficulty || "Medium");
    useExamStore.getState().setField("types", ["mcq", "short"]);
    toast.message("Generating Mock Exam", { description: "Configured from PYQ trends." });
    navigate("/exam");
    setTimeout(() => {
      useExamStore.getState().generate();
    }, 100);
  };
  const genQuiz = (topic: string) => {
    useQuizStore.getState().setField("topic", topic);
    useQuizStore.getState().setField("course", course);
    navigate("/quiz");
  };
  const genRevision = (topic: string) => {
    useRevisionStore.getState().setField("topic", topic);
    useRevisionStore.getState().setField("course", course);
    navigate("/revision");
  };
  const genFlashcards = (topic: string) => {
    navigate(`/flashcards?topic=${encodeURIComponent(topic)}&course=${encodeURIComponent(course)}`);
  };

  const handleSyncKG = async () => {
    const result = await syncToKG();
    if (result) {
      toast.success("Synced to Knowledge Graph", {
        description: `${result.created} topics added, ${result.updated} updated.`,
      });
    }
  };

  const handleUploadFile = async (file: File) => {
    const courseName = usePyqStore.getState().course;
    if (!courseName) throw new Error("Select a course first");
    const res = await api.uploadPyqPaper(file, courseName);
    toast.success(`Extracted ${res.extracted} questions from ${res.paper.title}`);
  };

  const handleBatchComplete = () => {
    refresh();
  };

  const hasData = !!analysis && analysis.totalQuestions > 0;

  return (
    <div className="h-full w-full overflow-y-auto scroll-smooth">
      <Container className="max-w-6xl py-6 font-kalam text-ink">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="size-5 text-violet" />
            <PaperH1 className="!text-[28px]">PYQ Analysis</PaperH1>
          </div>
          <p className="mt-1 font-kalam text-sm text-ink-muted/80">
            Turn previous-year question papers into exam intelligence.
          </p>
          {hasData && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Analyzed: <b>{analysis!.papers}</b> papers</span>
              {analysis!.yearsLabel && <span>Years: <b>{analysis!.yearsLabel}</b></span>}
              <span>Questions: <b>{analysis!.totalQuestions}</b></span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-44">
            <PaperSelect
              value={course ?? undefined}
              onChange={(v) => selectCourse(v)}
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
              placeholder="Select course"
            />
          </div>
          <GhostButton onClick={() => refresh()} disabled={!course || loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </GhostButton>

          {hasData && (
            <>
              <GhostButton size="sm" onClick={handleSyncKG}>
                <Share2 className="size-4" /> Sync to KG
              </GhostButton>
              <PaperButton size="sm" onClick={seedExam}>
                <GraduationCap className="size-4" /> Generate Mock Exam
              </PaperButton>
            </>
          )}
        </div>
      </div>

      {course && (
        <UploadZone
          onUploadFile={handleUploadFile}
          onBatchComplete={handleBatchComplete}
          multiple={false}
          label="Upload previous year question papers"
          description="PDF, Markdown or plain text — we'll extract questions, topics, and patterns."
        />
      )}

      {!course && (
        <p className="text-sm text-muted-foreground">Create a course first to analyze its papers.</p>
      )}


      {hasData && (
        <div className="space-y-8">
          <SummaryCards a={analysis!} />
          <div className="grid gap-6 lg:grid-cols-2">
            <TopicFrequency
              rows={analysis!.topicFrequency}
              onOpen={(t) => setField("selectedTopic", t)}
              onQuiz={genQuiz}
              onNotes={genRevision}
              onFlashcards={genFlashcards}
            />
            <QuestionPatterns />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <YearTimeline trends={analysis!.yearTrends} />
            <DifficultyDistribution dist={analysis!.difficulty} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <MarksDistribution dist={analysis!.marksDistribution} />
            <DifferenceSuggestions />
          </div>
          <RevisionRisk onExam={seedExam} onNotes={genRevision} onFlashcards={genFlashcards} />
          <ExamReadiness a={analysis!} />
          <QuestionExplorer />
          <PaperList papers={papers} />
        </div>
      )}

      <TopicDrawer onQuiz={genQuiz} onNotes={genRevision} onFlashcards={genFlashcards} onExam={seedExam} />
      </Container>
    </div>
  );
}

/* ---------------- Summary cards ---------------- */

function SummaryCards({ a }: { a: NonNullable<ReturnType<typeof usePyqStore.getState>["analysis"]> }) {
  const s = a.summary;
  const cards = [
    { label: "Topics Identified", value: s.topicsIdentified ?? 0, icon: Layers },
    { label: "Recurring Topics", value: s.recurringTopics ?? 0, icon: RefreshCw },
    { label: "Question Types", value: s.questionTypes ?? 0, icon: ListChecks },
    { label: "Avg Difficulty", value: s.avgDifficulty ?? "—", icon: AlertTriangle },
    { label: "Coverage", value: `${s.coverage ?? 0}%`, icon: BookOpen },
    { label: "Exam Readiness", value: `${s.readiness ?? 0}%`, icon: GraduationCap },
  ];
  return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <PaperMetricCard key={c.label} label={c.label} value={c.value} icon={c.icon} />
      ))}
    </div>
  );
}

/* ---------------- Topic frequency table ---------------- */

function TopicFrequency({
  rows,
  onOpen,
  onQuiz,
  onNotes,
  onFlashcards,
}: {
  rows: PyqTopicFreq[];
  onOpen: (t: string) => void;
  onQuiz: (t: string) => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Topic Frequency
      </h3>
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 font-medium">Topic</th>
              <th className="py-2 font-medium">Occ.</th>
              <th className="py-2 font-medium">Trend</th>
              <th className="py-2 font-medium">Importance</th>
              <th className="py-2 font-medium">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.topic} className="border-b border-border/50 last:border-0">
                <td className="py-2">
                  <button className="text-left font-medium hover:text-violet" onClick={() => onOpen(r.topic)}>
                    {r.topic}
                  </button>
                </td>
                <td className="py-2">{r.occurrences}</td>
                <td className="py-2"><TrendIcon trend={r.trend} /></td>
                <td className="py-2"><Stars n={r.importance} /></td>
                <td className="py-2"><Accuracy value={r.accuracy} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------------- Question patterns ---------------- */

function QuestionPatterns() {
  const patterns = usePyqStore((s) => s.analysis?.patterns ?? []);
  const selected = usePyqStore((s) => s.selectedPattern);
  const setField = usePyqStore((s) => s.setField);
  const active = patterns.find((p) => p.type === selected);
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Question Patterns
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {patterns.map((p) => (
          <button
            key={p.type}
            onClick={() => setField("selectedPattern", selected === p.type ? null : p.type)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              selected === p.type ? "border-violet bg-violet-soft/40" : "border-border hover:border-foreground/20"
            }`}
          >
            <div className="font-display text-xl">{p.pct}%</div>
            <div className="text-xs text-muted-foreground">{p.label}</div>
          </button>
        ))}
      </div>
      {active && (
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">Examples</p>
          {active.examples.map((ex, i) => (
            <p key={i} className="text-sm text-foreground/80">• {ex}</p>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Year timeline ---------------- */

function YearTimeline({ trends }: { trends: { topic: string; years: { year: number; count: number }[] }[] }) {
  const maxCount = useMemo(
    () => Math.max(1, ...trends.flatMap((t) => t.years.map((y) => y.count))),
    [trends],
  );
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Topic Trend Timeline
      </h3>
      {trends.length === 0 && <p className="text-sm text-muted-foreground">No year data in these papers.</p>}
      <div className="space-y-3">
        {trends.map((t) => (
          <div key={t.topic}>
            <div className="mb-1 text-sm font-medium">{t.topic}</div>
            <div className="flex items-end gap-2">
              {t.years.map((y) => (
                <div key={y.year} className="flex flex-col items-center gap-1">
                  <div
                    className="w-6 rounded-t bg-violet/70"
                    style={{ height: `${8 + (y.count / maxCount) * 40}px` }}
                    title={`${y.count} question(s)`}
                  />
                  <span className="text-[10px] text-muted-foreground">{y.year}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Difficulty distribution ---------------- */

function DifficultyDistribution({ dist }: { dist: { level: string; count: number }[] }) {
  const total = Math.max(1, dist.reduce((a, d) => a + d.count, 0));
  const tone: Record<string, string> = { Easy: "bg-success", Medium: "bg-warning", Hard: "bg-danger" };
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Difficulty Distribution
      </h3>
      <div className="space-y-3">
        {dist.map((d) => (
          <div key={d.level}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{d.level}</span>
              <span className="text-muted-foreground">{d.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={`h-full ${tone[d.level] ?? "bg-violet"}`} style={{ width: `${(d.count / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Marks distribution ---------------- */

function MarksDistribution({ dist }: { dist: { marks: number; count: number }[] }) {
  const total = Math.max(1, dist.reduce((a, d) => a + d.count, 0));
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Marks Distribution
      </h3>
      {dist.length === 0 ? (
        <p className="text-sm text-muted-foreground">No marks data in these papers.</p>
      ) : (
        <div className="space-y-3">
          {dist.map((d) => (
            <div key={d.marks}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{d.marks} marks</span>
                <span className="text-muted-foreground">{d.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-violet/70" style={{ width: `${(d.count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Difference suggestions ---------------- */

function DifferenceSuggestions() {
  const differences = usePyqStore((s) => s.differences);
  const navigate = useNavigate();
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Comparison Suggestions
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        Recurring "X vs Y" comparisons mined from past papers.
      </p>
      {differences.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comparison questions detected yet.</p>
      ) : (
        <div className="space-y-2">
          {differences.map((d, i) => (
            <button
              key={i}
              onClick={() => navigate(`/differences?a=${encodeURIComponent(d.a)}&b=${encodeURIComponent(d.b)}`)}
              className="flex w-full items-center justify-between gap-2 rounded-lg border border-border p-3 text-left hover:border-foreground/20"
              title={d.example}
            >
              <span className="text-sm">
                <b>{d.a}</b> <span className="text-muted-foreground">vs</span> <b>{d.b}</b>
              </span>
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                {d.count > 1 && <PaperBadge className="text-xs">{d.count}×</PaperBadge>}
                <Columns2 className="size-4" />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Revision risk ---------------- */

function RevisionRisk({
  onExam,
  onNotes,
  onFlashcards,
}: {
  onExam: () => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
}) {
  const risk = usePyqStore((s) => s.analysis?.revisionRisk ?? []);
  const tone: Record<string, string> = {
    High: "border-danger/40 bg-danger/5",
    Medium: "border-warning/40 bg-warning/5",
    Low: "border-success/40 bg-success/5",
  };
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Revision Risk Dashboard
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        High frequency + low accuracy = high risk. Based on topics you've practiced.
      </p>
      {risk.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Take a PYQ mock exam to build per-topic accuracy and surface revision priorities.{" "}
          <button className="text-violet hover:underline" onClick={onExam}>Generate one →</button>
        </p>
      ) : (
        <div className="space-y-2">
          {risk.map((r) => (
            <div key={r.topic} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 ${tone[r.risk]}`}>
              <div>
                <div className="font-medium">{r.topic}</div>
                <div className="text-xs text-muted-foreground">
                  Appears {r.occurrences}× · Accuracy {r.accuracy}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PaperBadge tone={r.risk === "High" ? "brick" : r.risk === "Medium" ? "ochre" : "sage"}>{r.risk} risk</PaperBadge>
                <GhostButton size="sm" onClick={() => onNotes(r.topic)}>
                  <NotebookPen className="size-4" /> Revise
                </GhostButton>
                <GhostButton size="sm" onClick={() => onFlashcards(r.topic)}>
                  <Layers className="size-4" /> Cards
                </GhostButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Exam readiness ---------------- */

function ExamReadiness({ a }: { a: NonNullable<ReturnType<typeof usePyqStore.getState>["analysis"]> }) {
  const r = a.readiness;
  const weak = r.weakTopics ?? [];
  const strong = r.strongTopics ?? [];
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Exam Readiness
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <div className="font-display text-3xl">{r.readiness ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Estimated readiness</div>
        </div>
        <div>
          <div className="font-display text-3xl">{r.coverage ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Topic coverage (practiced)</div>
        </div>
        <div className="text-sm">
          <div className="text-success">{strong.length} strong</div>
          <div className="text-danger">{weak.length} weak</div>
        </div>
      </div>
      {(weak.length > 0 || strong.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {strong.map((t) => <PaperBadge key={t} className="border-success/40 text-success">{t}</PaperBadge>)}
          {weak.map((t) => <PaperBadge key={t} className="border-danger/40 text-danger">{t}</PaperBadge>)}
        </div>
      )}
      {weak.length === 0 && strong.length === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          No practice data yet — readiness is an estimate built from PYQ mock-exam results.
        </p>
      )}
    </section>
  );
}

/* ---------------- Question card (inline edit/delete) ---------------- */

const QTYPES = [
  "definition", "explanation", "comparison", "advantages", "architecture",
  "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other",
];

function QuestionCard({ q }: { q: PyqQuestion }) {
  const updateQuestion = usePyqStore((s) => s.updateQuestion);
  const deleteQuestion = usePyqStore((s) => s.deleteQuestion);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...q });

  useEffect(() => {
    if (!editing) setDraft({ ...q });
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    try {
      await updateQuestion(q.id, {
        text: draft.text,
        topic: draft.topic,
        subtopics: draft.subtopics,
        difficulty: draft.difficulty,
        type: draft.type,
        marks: draft.marks,
        year: draft.year,
      });
      setEditing(false);
    } catch {
      // error toast already shown by updateQuestion; keep editing open
    }
  };

  const handleDelete = () => {
    if (window.confirm("Remove this question?")) {
      deleteQuestion(q.id);
    }
  };

  if (editing) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
        <textarea
          className="w-full rounded border border-border bg-background p-2 text-sm resize-none"
          rows={3}
          value={draft.text}
          onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
        />
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-36"
            placeholder="Topic"
            value={draft.topic}
            onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
          />
          <select
            className="rounded border border-border bg-background px-2 py-1 text-xs"
            value={draft.difficulty}
            onChange={(e) => setDraft((d) => ({ ...d, difficulty: e.target.value }))}
          >
            {["Easy", "Medium", "Hard"].map((v) => <option key={v}>{v}</option>)}
          </select>
          <select
            className="rounded border border-border bg-background px-2 py-1 text-xs"
            value={draft.type}
            onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
          >
            {QTYPES.map((v) => <option key={v}>{v}</option>)}
          </select>
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-20"
            type="number"
            placeholder="Marks"
            value={draft.marks ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, marks: e.target.value ? Number(e.target.value) : null }))}
          />
          <input
            className="rounded border border-border bg-background px-2 py-1 text-xs w-20"
            type="number"
            placeholder="Year"
            value={draft.year ?? ""}
            onChange={(e) => setDraft((d) => ({ ...d, year: e.target.value ? Number(e.target.value) : null }))}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs bg-primary text-primary-foreground hover:opacity-90"
            onClick={handleSave}
          >
            <Save className="size-3" /> Save
          </button>
          <button
            className="flex items-center gap-1 rounded px-2 py-1 text-xs border border-border hover:bg-muted"
            onClick={() => { setDraft({ ...q }); setEditing(false); }}
          >
            <X className="size-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm flex-1">{q.text}</p>
        <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Edit question"
            onClick={() => { setDraft({ ...q }); setEditing(true); }}
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-danger"
            title="Delete question"
            onClick={handleDelete}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        <PaperBadge>{q.topic}</PaperBadge>
        {q.subtopics?.map((st) => <PaperBadge key={st} className="text-violet">{st}</PaperBadge>)}
        <PaperBadge className="text-sm">{q.difficulty}</PaperBadge>
        <PaperBadge>{q.type.replace(/_/g, " ")}</PaperBadge>
        {q.marks != null && <PaperBadge>{q.marks} marks</PaperBadge>}
        {q.year != null && <PaperBadge>{q.year}</PaperBadge>}
      </div>
    </div>
  );
}

/* ---------------- Question explorer ---------------- */

function QuestionExplorer() {
  const questions = usePyqStore((s) => s.questions);
  const analysis = usePyqStore((s) => s.analysis);
  const filters = usePyqStore((s) => s.filters);
  const setFilter = usePyqStore((s) => s.setFilter);
  const fetchQuestions = usePyqStore((s) => s.fetchQuestions);

  const topics = analysis?.topicFrequency.map((t) => t.topic) ?? [];
  const years = useMemo(
    () => [...new Set(questions.map((q) => q.year).filter((y): y is number => y != null))].sort((a, b) => b - a),
    [questions],
  );

  // Re-fetch when structured filters change (search is debounced separately below).
  useEffect(() => {
    fetchQuestions();
  }, [filters.year, filters.topic, filters.difficulty, filters.type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Question Explorer
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <PaperInput
            placeholder="Search questions…"
            className="pl-8"
            value={filters.q ?? ""}
            onChange={(e) => { setFilter("q", e.target.value); }}
            onKeyDown={(e) => { if (e.key === "Enter") fetchQuestions(); }}
            icon={<Search />}
          />
        </div>
        <FilterSelect label="Topic" value={filters.topic} options={topics} onChange={(v) => setFilter("topic", v)} />
        <FilterSelect label="Difficulty" value={filters.difficulty} options={["Easy", "Medium", "Hard"]} onChange={(v) => setFilter("difficulty", v)} />
        <FilterSelect label="Type" value={filters.type} options={["definition", "explanation", "comparison", "advantages", "architecture", "case_study", "numerical", "problem_solving", "short_answer", "long_answer", "other"]} onChange={(v) => setFilter("type", v)} />
        <FilterSelect label="Year" value={filters.year != null ? String(filters.year) : undefined} options={years.map(String)} onChange={(v) => setFilter("year", v ? Number(v) : undefined)} />
      </div>
      <div className="max-h-[460px] space-y-2 overflow-y-auto">
        {questions.length === 0 && <p className="text-sm text-muted-foreground">No questions match these filters.</p>}
        {questions.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: string[];
  onChange: (v: string | undefined) => void;
}) {
  const opts = [{ value: "", label: `All ${label.toLowerCase()}` }, ...options.map((o) => ({ value: o, label: o }))];
  return (
    <div className="w-32">
      <PaperSelect
        value={value ?? ""}
        onChange={(v) => onChange(v === "" ? undefined : v)}
        options={opts}
        placeholder={label}
      />
    </div>
  );
}

/* ---------------- Paper list ---------------- */

function PaperList({ papers }: { papers: ReturnType<typeof usePyqStore.getState>["papers"] }) {
  const deletePaper = usePyqStore((s) => s.deletePaper);
  if (papers.length === 0) return null;
  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Analyzed Papers
      </h3>
      <div className="space-y-2">
        {papers.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {p.year ? `${p.year} · ` : ""}{p.questionCount} questions · {p.createdAt}
                </div>
              </div>
            </div>
            <GhostButton size="sm" onClick={() => deletePaper(p.id)}>
              <Trash2 className="size-4" />
            </GhostButton>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Topic detail drawer ---------------- */

function TopicDrawer({
  onQuiz,
  onNotes,
  onFlashcards,
  onExam,
}: {
  onQuiz: (t: string) => void;
  onNotes: (t: string) => void;
  onFlashcards: (t: string) => void;
  onExam: () => void;
}) {
  const topic = usePyqStore((s) => s.selectedTopic);
  const analysis = usePyqStore((s) => s.analysis);
  const setField = usePyqStore((s) => s.setField);
  const row = analysis?.topicFrequency.find((t) => t.topic === topic);
  const trend = analysis?.yearTrends.find((t) => t.topic === topic);
  return (
    <PaperDrawer open={!!topic} onClose={() => setField("selectedTopic", null)} title={topic ?? undefined} side="right" width={480}>
      {row && (
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><span className="text-muted-foreground">Frequency:</span> {row.frequency}</div>
            <div><span className="text-muted-foreground">Occurrences:</span> {row.occurrences}</div>
            <div className="flex items-center gap-1"><span className="text-muted-foreground">Trend:</span> <TrendIcon trend={row.trend} /> {row.trend}</div>
            <div className="flex items-center gap-1"><span className="text-muted-foreground">Importance:</span> <Stars n={row.importance} /></div>
          </div>
          <div>
            <span className="text-muted-foreground">Your performance: </span>
            <Accuracy value={row.accuracy} />
          </div>
          {row.subtopics.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Subtopics / related concepts</p>
              <div className="flex flex-wrap gap-1.5">
                {row.subtopics.map((s) => <PaperBadge key={s} className="text-violet">{s}</PaperBadge>)}
              </div>
            </div>
          )}
          {row.styles.length > 0 && (
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">Common question styles</p>
              <div className="flex flex-wrap gap-1.5">
                {row.styles.map((s) => <PaperBadge key={s}>{s.replace(/_/g, " ")}</PaperBadge>)}
              </div>
            </div>
          )}
          {trend && (
            <YearTimeline trends={[trend]} />
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            <GhostButton size="sm" onClick={() => onNotes(row.topic)}><NotebookPen className="size-4" /> Notes</GhostButton>
            <GhostButton size="sm" onClick={() => onFlashcards(row.topic)}><Layers className="size-4" /> Flashcards</GhostButton>
            <GhostButton size="sm" onClick={() => onQuiz(row.topic)}><ListChecks className="size-4" /> Quiz</GhostButton>
            <PaperButton size="sm" onClick={onExam}><GraduationCap className="size-4" /> Mock Exam</PaperButton>
          </div>
        </div>
      )}
    </PaperDrawer>
  );
}
