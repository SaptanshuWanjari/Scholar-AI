import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Layers,
  ListChecks,
  Clock,
  Sparkles,
  ArrowRight,
  Lightbulb,
  Milestone,
  CheckCircle2,
  Archive,
} from "lucide-react";
import { motion } from "motion/react";
import { Page, SectionTitle } from "../components/Page";
import { MetricCard } from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { api, type DashboardData, type LearningPathMeta, type LearningPath } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

export function Dashboard() {
  const navigate = useNavigate();
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

  return (
    <Page className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6"
      >
        <div>
          <h1 className="mt-3 text-[2.5rem] leading-none">
            Good evening, Student.
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/ask")}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Sparkles className="size-4" /> Ask AI
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/teach")}
            className="gap-2"
          >
            <Lightbulb size={16} /> Teach Me
          </Button>
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
              className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-primary mb-1">Continue Learning</p>
                  <h2 className="text-2xl font-bold text-foreground">{activePathDetails.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round((activePathDetails.progress.conceptsDone / Math.max(1, activePathDetails.progress.conceptsTotal)) * 100)}% completed
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Milestone className="size-6" />
                </div>
              </div>

              <div className="rounded-xl bg-card border border-border p-5 mb-6">
                <h3 className="text-sm font-medium text-foreground mb-2">Next up:</h3>
                {activePathDetails.nextRecommendation ? (
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
                      <Sparkles className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activePathDetails.nextRecommendation.conceptTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activePathDetails.nextRecommendation.reason}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">You are all caught up! Review your completed topics.</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate("/learning-path")}>
                  View All Paths
                </Button>
                <Button onClick={() => navigate(`/learning-path/${activePathDetails.id}`)} className="gap-2 bg-primary text-primary-foreground">
                  Continue <ArrowRight className="size-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-4">
                <Milestone className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No active learning path</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Generate a personalized learning path from your documents to get a structured study roadmap.
              </p>
              <Button onClick={() => navigate("/learning-path")} className="gap-2 bg-primary text-primary-foreground">
                <Sparkles className="size-4" /> Generate Path
              </Button>
            </div>
          )}

          {/* Metrics Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Documents" value={metrics?.documents ?? documents.length} icon={FileText} accent="#8b5cf6" hint={`${courses.length} courses`} />
            <MetricCard label="Flashcards" value={metrics?.flashcards ?? 0} icon={Layers} accent="#06b6d4" hint="across all decks" />
            <MetricCard label="Quizzes" value={metrics?.quizzesTaken ?? 0} icon={ListChecks} accent="#22c55e" />
            <MetricCard label="Sessions" value={metrics?.studySessions ?? 0} icon={Clock} accent="#f59e0b" />
          </div>

          {/* Recent documents */}
          <div>
            <SectionTitle
              title="Recent documents"
              action={
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => navigate("/documents")}>
                  View all <ArrowRight className="size-3" />
                </Button>
              }
            />
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {documents.slice(0, 4).map((d, i) => (
                <div key={d.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-accent/40 ${i !== 0 ? "border-t border-border" : ""}`}>
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.course} · {d.pages} pages</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{d.addedAt}</span>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">No documents found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Archived Paths */}
          {archivedPaths.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <SectionTitle title="Archived Paths" />
              <div className="space-y-2">
                {archivedPaths.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40 cursor-pointer" onClick={() => navigate(`/learning-path/${p.id}`)}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Archive className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground">{p.course}</div>
                    </div>
                    <CheckCircle2 className="size-4 text-success" />
                  </div>
                ))}
              </div>
              {archivedPaths.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs" onClick={() => navigate("/learning-path")}>
                  View all archives
                </Button>
              )}
            </div>
          )}

          {/* Recent sessions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Recent sessions" />
            <div className="space-y-2">
              {dashboard?.recentSessions?.length ? (
                dashboard.recentSessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                      <Clock className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.course}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{s.duration}</div>
                      <div>{s.date}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">No sessions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
