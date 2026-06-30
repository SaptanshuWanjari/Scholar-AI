import { Network } from "lucide-react";
import { PaperCard, PaperPanel } from "@/paper-ui/core";
import { SketchBorder } from "@/paper-ui/core";
import { SectionLabel } from "@/paper-ui/core";
import { SketchProgress } from "../progress/SketchProgress";
import { StickyNote } from "../decorations/StickyNote";
import { SketchButton, PaperButton } from "../buttons/Buttons";
import { SignpostDoodle, ArrowDoodle, CheckmarkDoodle } from "../doodles";

export interface ContinueLearningCardProps {
  course: string;
  percent: number;
  nextTitle: string;
  nextNote: string;
  onViewAll?: () => void;
  onContinue?: () => void;
}

/** The largest sheet — current learning path with a pinned sticky note. */
export function ContinueLearningCard({
  course,
  percent,
  nextTitle,
  nextNote,
  onViewAll,
  onContinue,
}: ContinueLearningCardProps) {
  return (
    <PaperCard lift className="overflow-visible px-7 pb-6 pt-6">
      {/* pinned sticky note, top-right */}
      <div className="absolute -right-3 -top-5 z-20">
        <StickyNote size={78} rotate={4}>
          <SignpostDoodle size={34} />
        </StickyNote>
      </div>

      <SectionLabel>Continue Learning</SectionLabel>
      <h3 className="mt-1 font-caveat text-[40px] font-bold leading-tight text-ink">{course}</h3>
      <p className="mb-4 font-kalam text-sm text-ink-muted">{percent}% completed</p>

      <div className="mb-7 w-[55%] max-w-[420px]">
        <SketchProgress value={percent} />
      </div>

      {/* Next up */}
      <PaperPanel className="px-5 py-4" border={{ stroke: "#cfc8b8", strokeWidth: 1.4, roughness: 1.2 }}>
        <p className="mb-3 font-architect text-[13px] uppercase tracking-wider text-ink-muted">
          Next up:
        </p>
        <div className="flex items-center gap-4">
          <span className="relative flex h-12 w-12 items-center justify-center text-ink">
            <SketchBorder stroke="#3a3733" strokeWidth={1.5} radius={8} roughness={1.2} bleed={5} />
            <span className="relative z-[1]">
              <Network size={24} strokeWidth={1.6} />
            </span>
          </span>
          <div>
            <h4 className="font-caveat text-2xl font-bold text-ink">{nextTitle}</h4>
            <p className="flex items-center gap-1.5 font-kalam text-sm text-ink-muted">
              {nextNote}
              <CheckmarkDoodle size={16} />
            </p>
          </div>
        </div>
      </PaperPanel>

      <div className="mt-6 flex justify-end gap-3">
        <SketchButton onClick={onViewAll}>View All Paths</SketchButton>
        <PaperButton tone="green" onClick={onContinue}>
          Continue <ArrowDoodle size={16} />
        </PaperButton>
      </div>
    </PaperCard>
  );
}
