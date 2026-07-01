// The ONLY module allowed to import @blocksuite/* directly.
// If an export name differs in the installed 0.19.5 types, correct it HERE.
export { DocCollection, Schema, Job, defineBlockSchema, BlockModel } from "@blocksuite/store";
export type { Doc, BlockSnapshot, DocSnapshot } from "@blocksuite/store";
export { AffineSchemas } from "@blocksuite/blocks";
export { PageEditorBlockSpecs } from "@blocksuite/blocks";
export { AffineEditorContainer } from "@blocksuite/presets";

// Registers all BlockSuite custom elements (editor container, native blocks).
// Must be invoked once before instantiating AffineEditorContainer. The presets
// `effects` internally also runs `@blocksuite/blocks/effects`. In 0.19.5 styles
// are CSS-in-JS (Lit), so there is no stylesheet to import.
export { effects as registerBlockSuiteEffects } from "@blocksuite/presets/effects";
