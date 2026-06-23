import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  FileText,
  Layers,
  ListChecks,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
} from "recharts";
import { Page, SectionTitle } from "../components/Page";
import { MetricCard } from "../components/MetricCard";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import type { DashboardData } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

const activityIcon: Record<string, typeof FileText> = {
  ask: Sparkles,
  flashcard: Layers,
  quiz: ListChecks,
  document: FileText,
  diagram: TrendingUp,
};

export function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    api
      .listCourses()
      .then(setCourses)
      .catch(() => { });
    api
      .listDocuments()
      .then(setDocuments)
      .catch(() => { });
    api
      .getDashboard()
      .then(setDashboard)
      .catch(() => { });
  }, []);

  const metrics = dashboard?.metrics;
  const studyActivity = dashboard?.studyActivity ?? [];
  const recentSessions = dashboard?.recentSessions ?? [];
  const activity = dashboard?.activity ?? [];

  return (
    <Page className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6"
      >
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Flame className="size-3.5 text-warning" /> 7-day study streak
          </div>
          <h1 className="mt-3 text-[2.5rem] leading-none">
            Good evening, Student.
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
            You have <span className="text-foreground">12 cards due</span> and{" "}
            <span className="text-foreground">2 weak topics</span> to revisit
            today. Pick up where you left off.
          </p>
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
            onClick={() => navigate("/flashcards")}
            className="gap-2"
          >
            <Layers className="size-4" /> Review cards
          </Button>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Documents"
          value={metrics?.documents ?? documents.length}
          icon={FileText}
          accent="#8b5cf6"
          hint={`${courses.length} courses`}
        />
        <MetricCard
          label="Flashcards"
          value={metrics?.flashcards ?? 0}
          icon={Layers}
          accent="#06b6d4"
          hint="across all decks"
        />
        <MetricCard
          label="Quizzes taken"
          value={metrics?.quizzesTaken ?? 0}
          icon={ListChecks}
          accent="#22c55e"
        />
        <MetricCard
          label="Study sessions"
          value={metrics?.studySessions ?? 0}
          icon={Clock}
          accent="#f59e0b"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Study activity */}
          <div>
            <SectionTitle title="Study activity" />
            <div className="rounded-2xl border border-border bg-card p-5">
              {studyActivity.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                  No study activity yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={208}>
                  <AreaChart
                    data={studyActivity}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="grad-minutes"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="grad-cards"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#06b6d4"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="100%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      stroke="currentColor"
                      className="text-muted-foreground"
                    />
                    <RTooltip
                      cursor={{ stroke: "var(--border)" }}
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      name="Minutes"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#grad-minutes)"
                    />
                    <Area
                      type="monotone"
                      dataKey="cards"
                      name="Cards"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#grad-cards)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent documents */}
          <div>
            <SectionTitle
              title="Recent documents"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() => navigate("/documents")}
                >
                  View all <ArrowRight className="size-3" />
                </Button>
              }
            />
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              {documents.slice(0, 4).map((d, i) => (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-accent/40 ${i !== 0 ? "border-t border-border" : ""
                    }`}
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{d.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.course} · {d.pages} pages
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {d.addedAt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Courses */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle
              title="Courses"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-0 text-xs hover:bg-transparent"
                  onClick={() => navigate("/knowledge")}
                >
                  <ArrowRight className="size-4" />
                </Button>
              }
            />
            <div className="space-y-3">
              {courses.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ x: 2 }}
                  className="group flex cursor-pointer items-center gap-3"
                  onClick={() => navigate("/knowledge")}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg font-semibold text-xs transition-colors group-hover:bg-opacity-30"
                    style={{ backgroundColor: `${c.color}15`, color: c.color }}
                  >
                    {c.code.split(" ")[0].slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium leading-none">
                      {c.name}
                    </div>
                    <div className="mt-1 flex gap-2 text-[11px] text-muted-foreground">
                      <span>{c.documents} docs</span>
                      <span className="opacity-40">•</span>
                      <span>{c.flashcards} cards</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Recent sessions" />
            <div className="space-y-2">
              {recentSessions.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No sessions yet
                </p>
              ) : (
                recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent/40"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-soft text-cyan">
                      <Clock className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{s.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.course}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{s.duration}</div>
                      <div>{s.date}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <SectionTitle title="Activity" />
            <div className="space-y-1">
              {activity.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  No activity yet
                </p>
              ) : (
                activity.map((a) => {
                  const Icon = activityIcon[a.kind] ?? Sparkles;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent/40"
                    >
                      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-snug">{a.text}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.time}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
