import { literal } from "lit/static-html.js";
import { BlockViewExtension, PageEditorBlockSpecs } from "../../../lib/blocksuite/api";
import type { ExtensionType } from "../../../lib/blocksuite/api";
import { registerScholarElements } from "./registerScholarBlock";

/**
 * Editor spec list = native page blocks + one BlockViewExtension per scholar
 * flavour (mapping flavour -> its custom-element tag). The scholar schemas are
 * registered separately on the collection; here we only wire the *views*.
 */
export function buildScholarSpecs(): ExtensionType[] {
  registerScholarElements();
  return [
    ...PageEditorBlockSpecs,
    BlockViewExtension("scholar:callout", literal`scholar-callout`),
    BlockViewExtension("scholar:sticky-note", literal`scholar-sticky-note`),
    BlockViewExtension("scholar:diagram", literal`scholar-diagram`),
    BlockViewExtension("scholar:page-break", literal`scholar-page-break`),
  ];
}
