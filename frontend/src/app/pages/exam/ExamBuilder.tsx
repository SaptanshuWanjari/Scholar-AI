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
import { PaperButton, ToggleButton } from "@paper-ui/components/buttons";
import { PaperInput, PaperSelect } from "@paper-ui/components/inputs";
import {
  PaperCard,
  PaperH1,
  PaperH5,
  PaperIconCircle,
  SectionLabel,
  PaperPanel,
} from "@paper-ui/core";
import { SketchDivider } from "@paper-ui/components/decorations";
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

const COVERAGE_OPTIONS = COVERAGE.map((c) => ({ value: c, label: c }));

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

  const courseOptions = [
    { value: "all", label: "All courses" },
    ...courses.map((c) => ({ value: c.name, label: c.name })),
  ];
  const documentOptions = [
    { value: "all", label: "All documents" },
    ...documents
      .filter((d) => (course !== "all" ? d.course === course : true))
      .map((d) => ({ value: d.id, label: d.title })),
  ];

  return (
    <Page className="max-w-3xl">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <PaperIconCircle tone="lavender" size={52}>
          <GraduationCap className="size-6" />
        </PaperIconCircle>
        <PaperH1 className="mt-4 text-4xl">Configure Mock Exam</PaperH1>
        <p className="mt-2 font-architect  text-ink-muted">
          Generate a realistic exam from your uploaded materials.
        </p>
      </div>

      <PaperPanel className="px-6 py-6" shadow="sm">
      <div className="space-y-6" data-tour="exam-setup">
        {/* Topic */}
        <Field icon={ListChecks} title="Topic" desc="What should the exam focus on?">
          <PaperInput
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Transformers, backpropagation…"
          />
        </Field>

        <SketchDivider variant="dashed" color="var(--color-pencil)" className="opacity-40" />

        {/* Source */}
        <Field
          icon={FileStack}
          title="Source Material"
          desc="Choose the course the exam draws from"
          tourId="exam-source"
        >
          <div className="flex flex-col gap-2">
            <PaperSelect
              value={course}
              onChange={setCourse}
              options={courseOptions}
              placeholder="All courses"
            />
            <PaperSelect
              value={document ?? "all"}
              onChange={(v) => setDocument(v === "all" ? null : v)}
              options={documentOptions}
              placeholder="All documents"
            />
          </div>
        </Field>

        <SketchDivider variant="dashed" color="var(--color-pencil)" className="opacity-40" />

        {/* Difficulty */}
        <Field icon={SlidersHorizontal} title="Difficulty">
          <Segmented
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
          />
        </Field>

        <SketchDivider variant="dashed" color="var(--color-pencil)" className="opacity-40" />

        {/* Question Types */}
        <Field icon={ListChecks} title="Question Types" desc="Select formats to include">
          <MultiSegmented
            options={TYPE_OPTIONS}
            values={types}
            onChange={(v) => {
              if (v.length > 0) setTypes(v);
            }}
          />
        </Field>

        <SketchDivider variant="dashed" color="var(--color-pencil)" className="opacity-40" />

        {/* Count & Time */}
        <div className="grid gap-4 sm:grid-cols-2">
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

        <SketchDivider variant="dashed" color="var(--color-pencil)" className="opacity-40" />

        {/* Coverage */}
        <Field icon={Layers3} title="Coverage">
          <PaperSelect
            value={coverage}
            onChange={setCoverage}
            options={COVERAGE_OPTIONS}
            placeholder="Select coverage"
          />
        </Field>

        <SketchDivider variant="wavy" />

        {/* Summary + Generate */}
        <PaperCard className="px-4 py-3" data-tour="exam-generate">
          <div className="flex items-center justify-between gap-4">
            <p className="font-architect  text-ink-muted">
              <span className="font-medium text-ink">{count} questions</span>
              {" · "}{difficulty}{" · "}{minutes} min{" · "}{coverage}
            </p>
            <PaperButton
              tone="dark"
              size="lg"
              onClick={generate}
              disabled={generating}
              className="gap-2 shrink-0"
            >
              {generating ? (
                <><Loader2 className="size-4 animate-spin" /> Generating…</>
              ) : (
                <><Sparkles className="size-4" /> Generate Mock Exam</>
              )}
            </PaperButton>
          </div>
        </PaperCard>

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
      </PaperPanel>
    </Page>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

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
    <div data-tour={tourId}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-4 text-ink-muted" />
        <SectionLabel className="text-[15px]">{title}</SectionLabel>
        {desc && (
          <span className="font-kalam text-xs text-ink-muted/70">· {desc}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Segmented ────────────────────────────────────────────────────────────────

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
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <ToggleButton
          key={o}
          pressed={value === o}
          onPressedChange={() => onChange(o)}
          size="md"
          className="flex-1 justify-center whitespace-nowrap"
        >
          {o}{suffix ? ` ${suffix}` : ""}
        </ToggleButton>
      ))}
    </div>
  );
}

// ─── MultiSegmented ───────────────────────────────────────────────────────────

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
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = values.includes(o.value);
        return (
          <ToggleButton
            key={o.value}
            pressed={active}
            onPressedChange={() =>
              onChange(
                active
                  ? values.filter((v) => v !== o.value)
                  : [...values, o.value],
              )
            }
            size="md"
            className="flex-1 justify-center whitespace-nowrap"
          >
            {o.label}
          </ToggleButton>
        );
      })}
    </div>
  );
}
