import { registerBlocksEffects, registerPresetEffects } from "../../../lib/blocksuite/api";

let registered = false;

/**
 * Register BlockSuite custom elements exactly once (idempotent). Order matters
 * only in that both must run before any AffineEditorContainer is constructed:
 * blocks' effects register the content-block elements (paragraph/note/root/…),
 * presets' effects register the editor container + panels.
 */
export function ensureBlockSuiteEffects(): void {
  if (registered) return;
  registered = true;
  registerBlocksEffects();
  registerPresetEffects();
}
