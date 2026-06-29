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
  Bookmark,
  Network,
  PenTool,
} from "lucide-react";
import { motion } from "motion/react";
import { Page, SectionTitle } from "../components/Page";
import { MetricCard } from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { api, type DashboardData, type LearningPathMeta, type LearningPath } from "../lib/api";
import { useSettingsStore } from "../stores/useSettingsStore";
import type { Course, DocumentItem } from "../lib/types";

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
  
  const getArtifactIcon = (type: string) => {
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
            {getGreeting()}, {userName}.
          </h1>
        </div>
        <div className="flex gap-2" data-tour="dashboard-actions">
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



          {/* Recent documents */}
          <div data-tour="dashboard-recent">
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

          {/* Unified Metrics List */}
          <div className="rounded-2xl border border-border bg-card p-5" data-tour="dashboard-metrics">
            <SectionTitle title="Your Stats" />
            <div className="space-y-1">
               <div className="flex items-center gap-3 rounded-lg p-2">
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#8b5cf614", color: "#8b5cf6" }}>
                   <FileText className="size-4" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="truncate text-sm font-medium">Documents</div>
                   <div className="text-xs text-muted-foreground">{courses.length} courses</div>
                 </div>
                 <div className="font-display text-xl">{metrics?.documents ?? documents.length}</div>
               </div>
               
               <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40 cursor-pointer" onClick={() => navigate("/flashcards")}>
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#eab30814", color: "#eab308" }}>
                   <Layers className="size-4" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="truncate text-sm font-medium">Cards due today</div>
                   <div className="text-xs text-muted-foreground">Review today</div>
                 </div>
                 <div className="font-display text-xl">{metrics?.flashcardsDue ?? 0}</div>
               </div>

               <div className="flex items-center gap-3 rounded-lg p-2">
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#06b6d414", color: "#06b6d4" }}>
                   <Layers className="size-4" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="truncate text-sm font-medium">Total Flashcards</div>
                   <div className="text-xs text-muted-foreground">Across all decks</div>
                 </div>
                 <div className="font-display text-xl">{metrics?.flashcards ?? 0}</div>
               </div>

               <div className="flex items-center gap-3 rounded-lg p-2">
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#22c55e14", color: "#22c55e" }}>
                   <ListChecks className="size-4" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="truncate text-sm font-medium">Quizzes taken</div>
                   <div className="text-xs text-muted-foreground">Total attempts</div>
                 </div>
                 <div className="font-display text-xl">{metrics?.quizzesTaken ?? 0}</div>
               </div>

               <div className="flex items-center gap-3 rounded-lg p-2">
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "#f59e0b14", color: "#f59e0b" }}>
                   <Clock className="size-4" />
                 </div>
                 <div className="min-w-0 flex-1">
                   <div className="truncate text-sm font-medium">Study sessions</div>
                   <div className="text-xs text-muted-foreground">Recorded sessions</div>
                 </div>
                 <div className="font-display text-xl">{metrics?.studySessions ?? 0}</div>
               </div>
            </div>
          </div>

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

          {/* Recent artifacts */}
          {dashboard?.recentArtifacts?.length ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Recently generated" />
            <div className="space-y-2">
                {dashboard.recentArtifacts.map((a) => {
                  const Icon = getArtifactIcon(a.type);
                  return (
                    <div key={`${a.type}-${a.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40 cursor-pointer" onClick={() => navigate(a.url)}>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm">{a.title}</div>
                        <div className="text-xs text-muted-foreground capitalize">{a.type}</div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {a.time}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          ) : null}

          {/* Recent bookmarks */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Recent bookmarks" />
            <div className="space-y-2">
              {dashboard?.recentBookmarks?.length ? (
                dashboard.recentBookmarks.map((bm) => (
                  <div key={bm.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40 cursor-pointer" onClick={() => navigate(`/reading?doc=${bm.docId}`)}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-soft text-emerald">
                      <Bookmark className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{bm.section || "Untitled section"}</div>
                      <div className="truncate text-xs text-muted-foreground">{bm.note || "No note"} · {bm.docTitle}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-xs text-muted-foreground">No recent bookmarks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
