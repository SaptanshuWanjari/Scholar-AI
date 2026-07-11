import { useEffect, useState } from "react";
import { History, FileText } from "lucide-react";
import { api } from "../../lib/api";
import type { ExamListItem } from "../../lib/api/exam";
import { PaperIconCircle, PaperPanel } from "@paper-ui/core";
import { SectionLabel } from "@paper-ui/core";
import { PaperBadge } from "@paper-ui/components/badges";
import { useExamStore } from "../../stores/useExamStore";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function SavedExams() {
  const [exams, setExams] = useState<ExamListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const loadExam = useExamStore((s) => s.loadExam);

  const fetch = () => {
    setLoading(true);
    api.listExams().then(setExams).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  if (loading) return null;
  if (exams.length === 0) return null;

  return (
    <PaperPanel className="mt-8 px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="size-4 text-ink-muted" />
          <SectionLabel className="text-[15px]">Saved Exams</SectionLabel>
        </div>
      </div>
      <div className="space-y-3">
        {exams.map((ex) => (
          <PaperPanel
            key={ex.sessionId}
            className="px-4 py-3 cursor-pointer hover:bg-ink/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            role="button"
            tabIndex={0}
            onClick={() => void loadExam(ex.sessionId)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); void loadExam(ex.sessionId); } }}
          >
            <div className="flex items-center justify-between min-w-0 w-full gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <PaperIconCircle tone={ex.submitted ? "sage" : "ochre"} size={36}>
                  <FileText className="size-4" />
                </PaperIconCircle>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-kalam text-[1.1rem] leading-snug text-ink">{ex.topic}</p>
                  <p className="truncate font-architect text-[0.85rem] text-ink-muted mt-0.5">
                    {ex.course && `${ex.course} · `}{ex.questionCount} questions · {formatDate(ex.startedAt)}
                  </p>
                </div>
              </div>
              <PaperBadge tone={ex.submitted ? "sage" : "ochre"} className="shrink-0 ml-4">
                {ex.submitted ? "Submitted" : "In Progress"}
              </PaperBadge>
            </div>
          </PaperPanel>
        ))}
      </div>
    </PaperPanel>
  );
}
