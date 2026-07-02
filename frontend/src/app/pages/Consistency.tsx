import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "@/app/lib/toast";
import { ConsistencyReport } from "../components/ConsistencyReport";
import { api, type ConsistencyReport as Report } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { AppShell } from "@paper-ui/components/layout";
import { PaperButton } from "@paper-ui/components/buttons";
import { PaperSelect } from "@paper-ui/components/inputs";
import { EmptyState, LoadingPaper } from "@paper-ui/components/feedback";
import { PaperCard, PaperH3, SectionHeader } from "@paper-ui/core";

export function Consistency() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [course, setCourse] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("scholar_consistency_state");
      return saved ? JSON.parse(saved).course : "none";
    } catch { return "none"; }
  });
  const [document, setDocument] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("scholar_consistency_state");
      return saved ? JSON.parse(saved).document : "all";
    } catch { return "all"; }
  });
  const [report, setReport] = useState<Report | null>(() => {
    try {
      const saved = localStorage.getItem("scholar_consistency_state");
      return saved ? JSON.parse(saved).report : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([c, d]) => {
        setCourses(c);
        setDocuments(d);
      })
      .catch(() => {});
  }, []);

  const visibleDocs =
    course === "none" ? documents : documents.filter((d) => d.course === course);

  const courseOptions = [
    { value: "none", label: "Select a course…" },
    ...courses.map((c) => ({ value: c.name, label: c.name })),
  ];

  const documentOptions = [
    { value: "all", label: "All documents" },
    ...visibleDocs.map((d) => ({ value: d.title, label: d.title })),
  ];

  async function analyze() {
    if (course === "none") {
      toast.error("Pick a course to analyze");
      return;
    }
    setLoading(true);
    try {
      const doc = document === "all" ? null : document;
      const result = await api.analyzeLibraryConsistency(course, doc);
      setReport(result);
      localStorage.setItem(
        "scholar_consistency_state",
        JSON.stringify({ course, document, report: result })
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to analyze consistency");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell fullscreen={false} className="h-full">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col gap-6 overflow-y-auto px-6 py-6">
        <PaperCard shadow="sm" className="p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-11 items-center justify-center rounded-full bg-sage-soft text-sage">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0">
              <PaperH3>Consistency Engine</PaperH3>
              <p className="mt-1 max-w-2xl text-sm text-ink-muted">
                Check that your saved artifacts for a course collectively cover the source
                material, instead of silently dropping concepts. Analysis only — nothing is
                regenerated or modified. Saved artifacts are linked by course, so analysis is
                scoped per course (a document only sharpens the concept checklist).
              </p>
            </div>
          </div>
        </PaperCard>

        <PaperCard shadow="sm" className="p-5">
          <SectionHeader title="Analysis inputs" />
          <div className="grid gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,18rem)_auto] lg:items-end">
            <PaperSelect
              value={course}
              onChange={(v) => {
                setCourse(v);
                setDocument("all");
              }}
              options={courseOptions}
              label="Course"
              placeholder="Pick a course"
              wrapperClassName="w-full"
              className="w-full"
            />
            <PaperSelect
              value={document}
              onChange={setDocument}
              options={documentOptions}
              label="Document (optional)"
              placeholder="All documents"
              wrapperClassName="w-full"
              className="w-full"
            />
            <PaperButton
              tone="dark"
              size="lg"
              className="gap-2 lg:justify-self-start"
              disabled={loading || course === "none"}
              onClick={() => void analyze()}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              Analyze
            </PaperButton>
          </div>
        </PaperCard>

        {loading ? (
          <PaperCard shadow="sm" className="p-6">
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <LoadingPaper variant="spinner" size="lg" />
              <p className="text-sm text-ink-muted">
                Extracting concepts and comparing saved artifacts…
              </p>
            </div>
          </PaperCard>
        ) : report ? (
          <div className="space-y-3">
            <SectionHeader title="Consistency report" />
            <ConsistencyReport
              report={report}
              course={course}
              onApply={async (artifactType, concepts) => {
                const result = await api.applyConsistencyFix(course, artifactType, concepts);
                if (result.applied) {
                  toast.success(`${artifactType} updated`, {
                    description: result.preview.slice(0, 120) + "…",
                  });
                } else {
                  toast.error(result.message);
                }
              }}
            />
          </div>
        ) : (
          <EmptyState
            icon={<ShieldCheck className="size-7 text-ink-muted/40" />}
            title="Run an analysis to see coverage"
            description="Pick a course and run an analysis to see how well your saved artifacts cover the source material."
            action={
              course === "none" ? (
                <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <AlertTriangle className="size-3" />
                  A course is required.
                </div>
              ) : null
            }
          />
        )}
      </div>
    </AppShell>
  );
}
