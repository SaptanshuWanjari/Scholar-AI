// Markdown formatting helpers for the Notebooks editor toolbar.
// These operate on a <textarea>, wrapping/prefixing the current selection with
// markdown syntax and restoring a sensible cursor/selection afterwards.

export type MarkdownAction =
  | "bold"
  | "italic"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "ul"
  | "ol"
  | "quote"
  | "link";

/** Wrap the textarea's current selection with `before`/`after`. Returns the new value. */
export function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string = before,
): string {
  const { selectionStart: s, selectionEnd: e, value } = el;
  const selected = value.slice(s, e) || "text";
  const next = value.slice(0, s) + before + selected + after + value.slice(e);
  // Re-select the inner text so repeated clicks/typing feel natural.
  queueMicrotask(() => {
    el.focus();
    el.setSelectionRange(s + before.length, s + before.length + selected.length);
  });
  return next;
}

/** Prefix each line of the selection (or current line) with `prefix`. */
export function prefixLines(el: HTMLTextAreaElement, prefix: string | ((i: number) => string)): string {
  const { selectionStart: s, selectionEnd: e, value } = el;
  // Expand selection to whole lines.
  const lineStart = value.lastIndexOf("\n", s - 1) + 1;
  const lineEnd = value.indexOf("\n", e);
  const end = lineEnd === -1 ? value.length : lineEnd;
  const block = value.slice(lineStart, end);
  const lines = block.split("\n");
  const out = lines
    .map((ln, i) => (typeof prefix === "string" ? prefix : prefix(i)) + ln)
    .join("\n");
  const next = value.slice(0, lineStart) + out + value.slice(end);
  queueMicrotask(() => {
    el.focus();
    el.setSelectionRange(lineStart, lineStart + out.length);
  });
  return next;
}

/** Apply a named markdown action to a textarea, returning its new value. */
export function applyMarkdown(el: HTMLTextAreaElement, action: MarkdownAction): string {
  switch (action) {
    case "bold":
      return wrapSelection(el, "**");
    case "italic":
      return wrapSelection(el, "*");
    case "code":
      return wrapSelection(el, "`");
    case "h1":
      return prefixLines(el, "# ");
    case "h2":
      return prefixLines(el, "## ");
    case "h3":
      return prefixLines(el, "### ");
    case "ul":
      return prefixLines(el, "- ");
    case "ol":
      return prefixLines(el, (i) => `${i + 1}. `);
    case "quote":
      return prefixLines(el, "> ");
    case "link":
      return wrapSelection(el, "[", "](url)");
    default:
      return el.value;
  }
}
