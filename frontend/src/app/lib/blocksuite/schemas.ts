import { defineBlockSchema, BlockModel } from "./api";

export type CalloutProps = { tone: "note" | "warning" | "insight"; text: string };
export type StickyProps = {
  text: string;
  color: "yellow" | "pink" | "green" | "blue" | "purple";
  pin: "push-pin" | "tape" | "none";
  align: "inline" | "right-rail";
};
export type DiagramProps = { code: string };
export type PageBreakProps = { label: string };

export const CalloutBlockSchema = defineBlockSchema({
  flavour: "scholar:callout",
  props: (): CalloutProps => ({ tone: "note", text: "" }),
  metadata: { version: 1, role: "content", parent: ["affine:note"], children: [] },
});
export const StickyNoteBlockSchema = defineBlockSchema({
  flavour: "scholar:sticky-note",
  props: (): StickyProps => ({ text: "", color: "yellow", pin: "push-pin", align: "inline" }),
  metadata: { version: 1, role: "content", parent: ["affine:note"], children: [] },
});
export const DiagramBlockSchema = defineBlockSchema({
  flavour: "scholar:diagram",
  props: (): DiagramProps => ({ code: "" }),
  metadata: { version: 1, role: "content", parent: ["affine:note"], children: [] },
});
export const PageBreakBlockSchema = defineBlockSchema({
  flavour: "scholar:page-break",
  props: (): PageBreakProps => ({ label: "" }),
  metadata: { version: 1, role: "content", parent: ["affine:note"], children: [] },
});

export const ScholarSchemas = [
  CalloutBlockSchema,
  StickyNoteBlockSchema,
  DiagramBlockSchema,
  PageBreakBlockSchema,
];

export type CalloutModel = BlockModel<CalloutProps>;
export type StickyModel = BlockModel<StickyProps>;
export type DiagramModel = BlockModel<DiagramProps>;
export type PageBreakModel = BlockModel<PageBreakProps>;
