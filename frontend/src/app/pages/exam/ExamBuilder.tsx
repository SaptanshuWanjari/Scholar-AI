import { useEffect, useState } from "react";
import {
  GraduationCap,
  FileStack,
  SlidersHorizontal,
  ListChecks,
  Clock,
  Layers3,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GenerationSteps } from "../../components/GenerationSteps";
import { cn } from "../../components/ui/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Page } from "../../components/Page";
import { api } from "../../lib/api";
import type { Course, DocumentItem } from "../../lib/types";
import { useExamStore } from "../../stores/useExamStore";

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Adaptive"];
const COVERAGE = [
  "Entire Course",
  "Selected Topics",
  "Weak Topics Only",
  "Recent Documents",
];

const TYPE_OPTIONS = [
  { label: "MCQ", value: "mcq" },
  { label: "True/False", value: "truefalse" },
  { label: "Short Answer", value: "short" },
  { label: "Long Answer", value: "long" },
];

export function ExamBuilder() {
  const topic = useExamStore((s) => s.topic);
  const course = useExamStore((s) => s.course);
  const difficulty = useExamStore((s) => s.difficulty);
  const count = useExamStore((s) => s.count);
  const minutes = useExamStore((s) => s.minutes);
  const coverage = useExamStore((s) => s.coverage);
  const types = useExamStore((s) => s.types);
  const generating = useExamStore((s) => s.generating);
  const setField = useExamStore((s) => s.setField);
  const generate = useExamStore((s) => s.generate);

  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const setTopic = (v: string) => setField("topic", v);
  const setCourse = (v: string) => setField("course", v);
  const document = useExamStore((s) => s.document);
  const setDocument = (v: string | null) => setField("document", v);
  const setDifficulty = (v: string) => setField("difficulty", v);
  const setCount = (v: number) => setField("count", v);
  const setMinutes = (v: number) => setField("minutes", v);
  const setCoverage = (v: string) => setField("coverage", v);
  const setTypes = (v: string[]) => setField("types", v);

  useEffect(() => {
    let active = true;
    api
      .listCourses()
      .then((cs) => {
        if (active) setCourses(cs);
      })
      .catch(() => {});
    api.listDocuments().then((ds) => { if (active) setDocuments(ds); }).catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <Page className="max-w-3xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border bg-card text-violet">
          <GraduationCap className="size-6" />
        </div>
        <h1 className="mt-4">Configure Mock Exam</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generate a realistic exam from your uploaded materials.
        </p>
      </div>

      <div className="space-y-5" data-tour="exam-setup">
        <Field
          icon={ListChecks}
          title="Topic"
          desc="What should the exam focus on?"
        >
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Transformers, backpropagation…"
            className="bg-input-background"
          />
        </Field>

        <Field
          icon={FileStack}
          title="Source Material"
          desc="Choose the course the exam draws from"
          tourId="exam-source"
        >
          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-full bg-input-background">
              <SelectValue placeholder="All courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={document ?? "all"} onValueChange={(v) => setDocument(v === "all" ? null : v)}>
            <SelectTrigger className="w-full bg-input-background mt-2">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {documents.filter(d => course !== "all" ? d.course === course : true).map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field icon={SlidersHorizontal} title="Difficulty">
          <Segmented
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </Field>

        <Field icon={ListChecks} title="Question Types" desc="Select formats to include">
          <MultiSegmented
            options={TYPE_OPTIONS}
            values={types}
            onChange={(v) => {
               if (v.length > 0) setTypes(v);
            }}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field icon={ListChecks} title="Questions">
            <Segmented
              options={["5", "8", "10", "15"]}
              value={String(count)}
              onChange={(v) => setCount(Number(v))}
            />
          </Field>
          <Field icon={Clock} title="Time Limit">
            <Segmented
              options={["15", "20", "30", "60"]}
              value={String(minutes)}
              onChange={(v) => setMinutes(Number(v))}
              suffix="min"
            />
          </Field>
        </div>

        <Field icon={Layers3} title="Coverage">
          <select
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-input-background px-3 text-sm outline-none focus:border-ring"
          >
            {COVERAGE.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
          data-tour="exam-generate"
        >
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {count} questions
            </span>{" "}
            · {difficulty} · {minutes} min · {coverage}
          </div>
          <Button
            onClick={generate}
            disabled={generating}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate Mock Exam
              </>
            )}
          </Button>
        </div>
        <GenerationSteps
          steps={[
            "Searching your library",
            "Drafting questions",
            "Calibrating difficulty",
            "Formatting exam",
          ]}
          loading={generating}
          interval={2500}
        />
      </div>
    </Page>
  );
}

function Field({
  icon: Icon,
  title,
  desc,
  children,
  tourId,
}: {
  icon: typeof FileStack;
  title: string;
  desc?: string;
  children: React.ReactNode;
  tourId?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4" data-tour={tourId}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
        {desc && (
          <span className="text-xs text-muted-foreground">· {desc}</span>
        )}
      </div>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  suffix,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <div className="flex rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            value === o
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
          {suffix ? ` ${suffix}` : ""}
        </button>
      ))}
    </div>
  );
}

function MultiSegmented({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-0.5">
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <button
            key={o.value}
            onClick={() =>
              onChange(
                active
                  ? values.filter((v) => v !== o.value)
                  : [...values, o.value],
              )
            }
            className={cn(
              "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
