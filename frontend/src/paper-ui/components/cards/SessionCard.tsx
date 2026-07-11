import { PaperCard } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { SketchDivider } from "../decorations/SketchDivider";
import { SessionRow, type SessionRowProps } from "../rows/SessionRow";
import { ArrowDoodle } from "../doodles";

export interface SessionCardProps {
  title: string;
  sessions: SessionRowProps[];
  onViewAll?: () => void;
}

/** A taped notebook sheet listing recent study sessions. */
export function SessionCard({ title, sessions, onViewAll }: SessionCardProps) {
  return (
    <PaperCard lift className="overflow-visible px-6 pb-5 pt-6">
      <SectionLabel>{title}</SectionLabel>
      <div className="mt-4 space-y-3">
        {sessions.map((s, i) => (
          <div key={i}>
            <SessionRow {...s} />
            {i !== sessions.length - 1 && (
              <SketchDivider variant="dashed" className="mt-3 opacity-60" />
            )}
          </div>
        ))}
      </div>
      {sessions.length > 0 && onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-5 inline-flex items-center gap-1.5 font-architect text-sm text-ink transition-colors hover:text-ink-muted"
        >
          View all sessions <ArrowDoodle size={15} />
        </button>
      )}
      {sessions.length === 0 && (
        <p className="mt-5 font-kalam text-sm text-ink-muted">
          No sessions yet. Start a new session to see it here.
        </p>
      )}
    </PaperCard>
  );
}
