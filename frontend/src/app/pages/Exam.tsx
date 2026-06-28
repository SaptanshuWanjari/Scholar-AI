import { useExamStore } from "../stores/useExamStore";
import { ExamBuilder } from "./exam/ExamBuilder";
import { ExamSession } from "./exam/ExamSession";
import { ExamResults } from "./exam/ExamResults";

export function Exam() {
  const stage = useExamStore((s) => s.stage);

  if (stage === "builder") return <ExamBuilder />;
  if (stage === "session") return <ExamSession />;
  return <ExamResults />;
}
