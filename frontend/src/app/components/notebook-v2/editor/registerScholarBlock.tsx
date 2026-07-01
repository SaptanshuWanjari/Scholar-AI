import { createScholarBlockClass } from "./ReactEmbedBlock";
import CalloutView from "../blocks/CalloutView";
import StickyNoteView from "../blocks/StickyNoteView";
import DiagramView from "../blocks/DiagramView";
import PageBreakView from "../blocks/PageBreakView";

/** flavour -> custom-element tag. `specs.ts` references the same tags. */
export const SCHOLAR_TAGS = {
  "scholar:callout": "scholar-callout",
  "scholar:sticky-note": "scholar-sticky-note",
  "scholar:diagram": "scholar-diagram",
  "scholar:page-break": "scholar-page-break",
} as const;

const VIEWS = {
  "scholar-callout": CalloutView,
  "scholar-sticky-note": StickyNoteView,
  "scholar-diagram": DiagramView,
  "scholar-page-break": PageBreakView,
} as const;

let defined = false;

/** Define every scholar view element once (idempotent). */
export function registerScholarElements(): void {
  if (defined) return;
  defined = true;
  for (const [tag, View] of Object.entries(VIEWS)) {
    if (!customElements.get(tag)) {
      customElements.define(tag, createScholarBlockClass(View as any) as any);
    }
  }
}
