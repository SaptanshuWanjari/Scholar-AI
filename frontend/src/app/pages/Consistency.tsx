import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Page, SectionTitle } from "../components/Page";
import { ConsistencyReport } from "../components/ConsistencyReport";
import { api, type ConsistencyReport as Report } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

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
    <Page>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ShieldCheck className="size-5 text-primary" />
          Consistency Engine
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Check that your saved artifacts for a course collectively cover the source
          material, instead of silently dropping concepts. Analysis only — nothing is
          regenerated or modified. Saved artifacts are linked by course, so analysis is
          scoped per course (a document only sharpens the concept checklist).
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Course
          </label>
          <Select value={course} onValueChange={(v) => { setCourse(v); setDocument("all"); }}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Pick a course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a course…</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Document (optional)
          </label>
          <Select value={document} onValueChange={setDocument}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All documents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All documents</SelectItem>
              {visibleDocs.map((d) => (
                <SelectItem key={d.id} value={d.title}>
                  {d.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="gap-2" disabled={loading || course === "none"} onClick={() => void analyze()}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
          Analyze
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="text-sm">Extracting concepts and comparing saved artifacts…</p>
        </div>
      ) : report ? (
        <div>
          <SectionTitle title="Consistency report" />
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
        <div className="flex flex-col items-center gap-3 pt-24 text-center text-muted-foreground">
          <ShieldCheck className="size-7 opacity-40" />
          <p className="max-w-sm text-sm">
            Pick a course and run an analysis to see how well your saved artifacts cover
            the source material.
          </p>
          {course === "none" && (
            <span className="flex items-center gap-1.5 text-[11px]">
              <AlertTriangle className="size-3" /> A course is required.
            </span>
          )}
        </div>
      )}
    </Page>
  );
}
