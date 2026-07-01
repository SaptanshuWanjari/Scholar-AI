import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";

interface ScrollSpySection {
  id: string;
  label: string;
}

export interface ScrollSpyRootProps {
  sections: ScrollSpySection[];
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  position?: "left" | "right";
  className?: string;
}

function ScrollSpyRoot({
  sections,
  activeSection,
  onSectionClick,
  position = "right",
  className,
}: ScrollSpyRootProps) {
  const positionClass = position === "left" ? "left-6" : "right-6";

  return (
    <div className={cn("fixed top-1/2 -translate-y-1/2 z-20", positionClass, className)}>
      <ScrollSpyTrack>
        {sections.map((section) => (
          <ScrollSpyMarker
            key={section.id}
            label={section.label}
            active={section.id === activeSection}
            onClick={() => onSectionClick?.(section.id)}
          />
        ))}
        <ScrollSpyThumb activeIndex={sections.findIndex((s) => s.id === activeSection)} count={sections.length} />
      </ScrollSpyTrack>
    </div>
  );
}
ScrollSpyRoot.displayName = "ScrollSpy.Root";

interface ScrollSpyTrackProps {
  children: React.ReactNode;
  className?: string;
}

function ScrollSpyTrack({ children, className }: ScrollSpyTrackProps) {
  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div className="relative flex flex-col items-center gap-3 px-2 py-4 rounded-full bg-[#fffdf9]/80">
        <SketchBorder
          fill="#fffdf9"
          stroke="#bdb7a8"
          strokeWidth={1.4}
          radius={24}
          roughness={1.1}
        />
        <span className="relative z-[1] flex flex-col items-center gap-3">
          {children}
        </span>
      </div>
    </div>
  );
}
ScrollSpyTrack.displayName = "ScrollSpy.Track";

interface ScrollSpyThumbProps {
  activeIndex: number;
  count: number;
  className?: string;
}

function ScrollSpyThumb({ activeIndex, count, className }: ScrollSpyThumbProps) {
  if (activeIndex < 0 || count === 0) return null;
  const top = 16 + activeIndex * 32;

  return (
    <span
      className={cn("absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-[2] transition-all duration-300", className)}
      style={{ top }}
    >
      {/* ponytail: doodle circle position indicator */}
      <svg viewBox="0 0 12 12" className="w-full h-full" fill="none" aria-hidden>
        <ellipse cx="6" cy="6" rx="5" ry="4.5" stroke="#3a3733" strokeWidth="1.6" />
      </svg>
    </span>
  );
}
ScrollSpyThumb.displayName = "ScrollSpy.Thumb";

interface ScrollSpyMarkerProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

function ScrollSpyMarker({ label, active, onClick, className }: ScrollSpyMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-2.5 h-2.5 rounded-full transition-all duration-200",
        active ? "bg-[#3a3733] scale-125" : "bg-[#bdb7a8]/50 hover:bg-[#bdb7a8]",
        className,
      )}
      title={label}
      aria-label={`Scroll to ${label}`}
    />
  );
}
ScrollSpyMarker.displayName = "ScrollSpy.Markers";

export const ScrollSpy = Object.assign(ScrollSpyRoot, {
  Track: ScrollSpyTrack,
  Thumb: ScrollSpyThumb,
  Markers: ScrollSpyMarker,
});

export type { ScrollSpyRootProps as ScrollSpyProps, ScrollSpySection };
