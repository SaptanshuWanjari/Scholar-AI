import { registerBlockSuiteEffects } from "../../../lib/blocksuite/api";

let registered = false;

/** Register BlockSuite custom elements exactly once (idempotent). */
export function ensureBlockSuiteEffects(): void {
  if (registered) return;
  registered = true;
  registerBlockSuiteEffects();
}
