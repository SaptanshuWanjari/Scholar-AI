// The ONLY module allowed to import @blocksuite/* directly.
// If an export name differs in the installed 0.19.5 types, correct it HERE.
export { DocCollection, Schema, Job, defineBlockSchema, BlockModel } from "@blocksuite/store";
export type { Doc, BlockSnapshot, DocSnapshot } from "@blocksuite/store";
export { AffineSchemas } from "@blocksuite/blocks";
export { PageEditorBlockSpecs } from "@blocksuite/blocks";
export { AffineEditorContainer } from "@blocksuite/presets";

// Registers BlockSuite custom elements. BOTH must be invoked once before
// instantiating AffineEditorContainer:
//  - blocks `effects()` registers content elements (paragraph, note, root, list,
//    code, image, …) via its cascade of affine-block-* sub-effects.
//  - presets `effects()` registers ONLY the editor container + panels; it does
//    NOT call blocks' effects (it merely side-effect-imports the module).
// In 0.19.5 styles are CSS-in-JS (Lit), so there is no stylesheet to import.
export { effects as registerBlocksEffects } from "@blocksuite/blocks/effects";
export { effects as registerPresetEffects } from "@blocksuite/presets/effects";
