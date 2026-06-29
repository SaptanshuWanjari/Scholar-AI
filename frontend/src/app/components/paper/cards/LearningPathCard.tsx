import React from "react";
import { cn } from "../../ui/utils";
import { PaperCard, PaperPanel } from "../foundation/Paper";
import { SectionLabel } from "../foundation/SectionHeader";
import { SketchBorder } from "../foundation/SketchBorder";
import { PaperButton } from "../buttons/Buttons";
import { CheckmarkDoodle, ArrowDoodle } from "../doodles";
import { SketchDivider } from "../decorations/SketchDivider";

export interface LearningStep {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  locked?: boolean;
}

export interface LearningPathCardProps {
  title: string;
  steps: LearningStep[];
  completedCount?: number;
  totalCount?: number;
  onContinue?: () => void;
  className?: string;
}

/**
 * Step-by-step learning path — numbered steps list with completion marks and
 * a highlighted current step.
 */
export function LearningPathCard({
  title,
  steps,
  completedCount,
  totalCount,
  onContinue,
  className,
}: LearningPathCardProps) {
  const done = completedCount ?? steps.filter((s) => s.completed).length;
  const total = totalCount ?? steps.length;

  return (
    <PaperCard className={cn("overflow-visible px-5 pb-5 pt-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <SectionLabel>Learning Path</SectionLabel>
          <h3 className="mt-0.5 font-caveat text-[26px] font-bold leading-tight text-ink">
            {title}
          </h3>
        </div>
        <span className="mt-1 shrink-0 font-architect text-[13px] text-ink-muted">
          {done}/{total}
        </span>
      </div>

      <div className="space-y-0.5">
        {steps.map((step, i) => (
          <div key={step.id}>
            <div
              className={cn(
                "relative flex items-start gap-3 rounded px-3 py-2.5",
                step.current && "bg-black/[0.03]",
                step.locked && "opacity-40",
              )}
            >
              {/* Step number / check */}
              <div className="relative mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center">
                {step.completed ? (
                  <CheckmarkDoodle size={22} />
                ) : step.current ? (
                  <>
                    <SketchBorder
                      fill="#262320"
                      stroke="#262320"
                      strokeWidth={1.5}
                      radius={12}
                      roughness={0.9}
                      bleed={3}
                    />
                    <span className="relative z-[1] font-architect text-[11px] font-bold text-[#fffdf9]">
                      {i + 1}
                    </span>
                  </>
                ) : (
                  <>
                    <SketchBorder
                      stroke="#b4ad9e"
                      strokeWidth={1.3}
                      radius={12}
                      roughness={1.1}
                      bleed={3}
                    />
                    <span className="relative z-[1] font-architect text-[11px] text-ink-muted/70">
                      {i + 1}
                    </span>
                  </>
                )}
              </div>

              {/* Label */}
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-architect text-[14px] leading-tight",
                    step.completed
                      ? "text-ink-muted/60 line-through"
                      : step.current
                        ? "font-medium text-ink"
                        : "text-ink/80",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 font-kalam text-[12px] text-ink-muted/65">
                    {step.description}
                  </p>
                )}
              </div>

              {step.current && (
                <ArrowDoodle size={15} className="mt-0.5 shrink-0 text-ink-muted/60" />
              )}
            </div>
            {i < steps.length - 1 && (
              <SketchDivider variant="dashed" className="mx-3 opacity-40" />
            )}
          </div>
        ))}
      </div>

      {onContinue && (
        <div className="mt-4 flex justify-end">
          <PaperButton tone="dark" size="sm" onClick={onContinue}>
            Continue <ArrowDoodle size={14} />
          </PaperButton>
        </div>
      )}
    </PaperCard>
  );
}
