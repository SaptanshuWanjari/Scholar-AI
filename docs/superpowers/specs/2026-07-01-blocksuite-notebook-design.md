# ScholarAI Notebook V2 — BlockSuite Engine + paper-ui

**Date:** 2026-07-01
**Status:** Design approved, ready for implementation plan
**Scope:** Replace the custom notebook-v2 block engine with BlockSuite, skinned with paper-ui.

---

## 1. Problem & Goal

The current `notebook-v2/` is a hand-rolled block system: a `V2Block` union
(`notebook-v2.types.ts`), a Zustand store with manual block CRUD
(`useNotebookV2Store.ts`), and per-type React renderers. It does **not** use the
installed `paper-ui` component library (`src/paper-ui/`), and it reimplements
editor concerns (drag-drop, ordering, collapse) that a real document engine
provides for free.

**Goal:** Adopt **BlockSuite** as the document engine and render block UI with
**paper-ui** components. BlockSuite owns the document (tree, editing, selection,
drag-drop, clipboard, undo/redo, serialization). ScholarAI owns the notebook
experience (paper layout, spiral, pages, navigation, toolbar, artifact
generation). The bridge between the two is a single thin Lit base class that
hosts React.

### Guiding principle

> The notebook experience belongs to ScholarAI. The document engine belongs to
> BlockSuite. Every study artifact is a first-class notebook block, not embedded
> content.

---

## 2. Approved Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Adopt BlockSuite now | Yes — replace the custom engine this round |
| 2 | React/Lit boundary | **Hybrid** — native BlockSuite blocks for prose; custom **embed blocks** whose Lit view hosts a React root rendering paper-ui |
| 3 | Page model | **One Doc per notebook**, pages are a **visual** layer |
| 4 | Persistence | **Dual-store.** BlockSuite **JSON Snapshot** in a NEW `bs_snapshot` column (editor's source of truth); the existing flat `blocks` column is kept as a backend-facing projection, regenerated from the snapshot on every save |
| 5 | v1 block scope | heading, text, callout, code, image, diagram (mermaid), sticky notes. **Remove ai-answer.** Defer table/whiteboard/flashdeck/quiz-results + all future types (arrive later as artifacts via the same embed pattern) |
| 6 | Editing surface | **Single continuous editable paper**; the two-page spread becomes a **read-only Reading mode** rendered from the snapshot; page-break markers + outline drive navigation |

---

## 3. Architecture

### 3.1 Layering

```
NotebookV2 (React route)
 └─ NotebookShell (React) ...... paper layout · spiral · toolbar · nav · outline
     └─ PaperSurface (paper-ui) . PaperSheetCard/Border + NotebookSpiral — NON-editable skin
         └─ EditorMount (div ref) ...... imperatively mounts the Lit editor ONCE
             └─ BlockSuite PageEditor (Lit) ..... document engine
                 ├─ affine:paragraph / affine:list / affine:code / affine:image .. NATIVE
                 └─ scholar:* embed blocks (Lit view → React root)
                     └─ paper-ui components (StickyNoteCard, Callout, Diagram…)
```

- The **paper** (texture, margins, spiral binding, page numbers) is paper-ui and
  is never editable.
- The **content region** is a single BlockSuite editor instance, mounted
  imperatively into a stable `div`. React never re-renders the editor subtree.

### 3.2 Packages

Add (versions pinned at implementation time against the installed API, since
BlockSuite reorganizes packages between majors):

- `@blocksuite/store` — `Doc`, `DocCollection`, `BlockModel`, schema, undo/redo, Job/adapter (snapshots)
- `@blocksuite/block-std` — `BlockSpec`, `BlockService`, `EditorHost`, selection, commands
- `@blocksuite/blocks` — native block specs, embed-block base, `PageEditorBlockSpecs`
- `@blocksuite/presets` — `PageEditor` / editor container
- `@blocksuite/inline` — inline rich-text
- `yjs` — CRDT backing store

> Implementation note: verify the exact export names and embed-block base class
> against the installed version before coding; the guide describes
> `defineEmbedModel` / `EmbedBlockComponent` / `createEmbedBlock`, but names may
> differ by version. Pin one version and lock it.

### 3.3 Editor bootstrap

A `useBlockSuiteEditor(notebookId)` hook:

1. Creates a `DocCollection` (one per app) and a `Doc` (one per notebook).
2. Registers the block spec set: native specs + the three `scholar:*` custom specs.
3. Instantiates the `PageEditor` web component and appends it to the mount `div`.
4. Returns `{ doc, editor, host }` for the shell and toolbar to call.
5. Tears down (unmounts editor, destroys root) on notebook change/unmount.

---

## 4. The React-in-Lit Bridge

One reusable base class, `ReactEmbedBlock`, extends BlockSuite's embed block
component:

- `connectedCallback`: `createRoot(this.reactHost)` then render
  `<BlockView model={this.model} doc={this.doc} host={this.host} />`.
- Re-render the React root when observed `model` props change.
- `disconnectedCallback`: `root.unmount()`.

Each custom block is three pieces:

1. **Schema** — `defineBlockSchema` (flavour `scholar:*`, versioned props).
2. **React view** — a paper-ui component reading from `model`, writing edits back
   via `doc.updateBlock(model, { ... })`.
3. **Spec** — registers schema + the `ReactEmbedBlock`-based view (+ optional service).

Selection, drag handles, and block-level menus are drawn by BlockSuite *around*
the embed; the React view only owns the block's interior.

### 4.1 v1 Block Mapping

| Block | Flavour | Implementation | paper-ui |
|-------|---------|----------------|----------|
| text / paragraph / list / quote | `affine:paragraph`, `affine:list` | **native**, restyled | CSS skin (paper fonts/ink) |
| heading (h1–h3) | `affine:paragraph` (type h1–h3) | **native**, restyled | `Headings` / `MarkerHighlight` styling |
| code | `affine:code` | **native** (lang selector + copy built in), restyled | paper frame via CSS |
| image | `affine:image` | **native** (upload/resize/caption), framed | paper frame / `FoldedCorner` |
| callout (note/warning/insight) | `scholar:callout` | **custom** React embed | callout card (tone→color) |
| sticky note | `scholar:sticky-note` | **custom** React embed | `StickyNoteCard` + `PushPin`/`Tape` |
| diagram (mermaid) | `scholar:diagram` | **custom** React embed (reuse existing `DiagramBlock`) | paper frame |
| page break | `scholar:page-break` | **custom** marker (thin divider) | `SketchDivider` |

Only **4 custom blocks** (callout, sticky-note, diagram, page-break) — keeping
the bridge surface minimal. Everything else is native BlockSuite, restyled.

### 4.2 Removed / deferred

- **ai-answer**: removed from v1 entirely.
- **table, whiteboard, flashdeck, quiz-results**: deferred. They are artifacts
  generated elsewhere in the app and will be inserted later using the same
  `ReactEmbedBlock` pattern (`scholar:artifact-*` flavours). Their existing
  components are retained under a `deferred/` folder (not registered) so code
  isn't lost.

---

## 5. Store & State

`useNotebookV2Store` is reduced to **UI state only**:

- active notebook id, current Reading-mode spread index, sidebar open/closed,
  cached outline.
- **No block content.** All content lives in the `Doc`. Mutations call
  `doc.addBlock` / `updateBlock` / `deleteBlock` / `moveBlock`; undo/redo,
  drag-drop, clipboard, and collapse come from BlockSuite.

The **outline** is derived by walking the block tree for heading paragraphs and
`scholar:page-break` markers, producing `Notebook → Page → Heading` entries.

`BlockContainer.tsx`, the manual drag/collapse/dedup-in-store logic, and the
hand-rolled CRUD in `useNotebookV2Store.ts` are removed — superseded by BlockSuite.

---

## 6. Pages, Paper & Reading Mode

- **Editing** happens in one continuous paper column: the live BlockSuite editor
  with a repeating paper-ui skin (texture + `NotebookSpiral`) behind it.
- **Pages** are visual. A `scholar:page-break` marker block denotes a page
  boundary; "New Page" inserts one. Page numbers and the outline derive from
  markers.
- **Reading mode** (the two-page spread from the screenshots) is a **read-only**
  view rendered from the current snapshot: blocks are laid into sheet-sized
  paper pages (split by page-break markers, then by height), shown one or two
  sheets at a time with the spiral binding between them. `Next/Prev` pages
  through it. Editing is disabled in this mode; the user toggles back to the
  continuous editor to make changes.
- The bottom **block toolbar** (Text, Heading, Sticky, Image, Diagram, Code, …)
  and page controls (New Page, Duplicate, Delete) are paper-ui buttons that call
  `doc.addBlock` / page-break insertion. Optionally wire BlockSuite's slash-menu
  widget for native blocks.

---

## 7. Persistence & Migration (Dual-Store)

> **Why dual-store:** the backend depends on `Notebook.blocks` being the **flat
> block array** in many places — `_reindex_notebook_chunks` →
> `notebook_block_text` (LanceDB search/RAG), `resolve_notebook_citations`,
> `_notebook_to_markdown` (citations, markdown, consistency service),
> `knowledge_service` search via `cast(Notebook.blocks, String).ilike(...)`, and
> `append_block` (`nb.blocks = [*nb.blocks, block]`, how artifacts get appended).
> Overwriting that column with a nested snapshot object would break all of them.
> So the snapshot lives in a **new** column and the flat array is preserved.

### 7.1 Storage

- **New column** `Notebook.bs_snapshot` (JSON, nullable) — the editor's source of
  truth. Holds the BlockSuite snapshot envelope:

  ```json
  { "format": "blocksuite-snapshot@1", "snapshot": { ...docSnapshot } }
  ```

- **Existing column** `Notebook.blocks` (flat array) — a **projection**,
  regenerated from the snapshot on every save. All backend consumers keep
  reading it unchanged.

### 7.2 Save path

On Doc change, the frontend (`NotebookV2.tsx` + `useAutoSave`) sends **both**:

1. `bs_snapshot` = `docToEnvelope(doc)` (BlockSuite snapshot envelope).
2. `blocks` = `projectSnapshotToFlat(doc)` — a flat `{ type, ...text }` array
   derived by walking the block tree, one entry per native/`scholar:*` block,
   shaped exactly like the legacy blocks the backend already understands.

`api.updateNotebook` accepts both fields; the backend stores them as-is.

### 7.3 Load & migration

On load, read `bs_snapshot`:

- If present → `envelopeToDoc(collection, envelope)`.
- If null → **one-time migration** from the flat `blocks` array
  (`legacyBlocksToSnapshot`): map each legacy block to a flavour
  (heading/text/callout/code/image/mermaid → their v1 targets; **dropped** types
  ai-answer/table/whiteboard/flashdeck/quiz-results → a native `affine:paragraph`
  placeholder preserving their text, so no content is lost). Legacy sticky notes
  on block metadata become standalone `scholar:sticky-note` blocks after their
  host. The next save writes `bs_snapshot`, so migration runs at most once.

### 7.4 Backend change

Minimal: **add the `bs_snapshot` column** (SQLAlchemy model + accept it in
`NotebookPatch`/`update_notebook`). No consumer rewrite — `blocks` still carries
the flat projection. A migration-safety unit test confirms `projectSnapshotToFlat`
output matches the shape `notebook_block_text` expects for each v1 block type.

### 7.5 Known limitation (v1)

External `append_block` writes (artifacts appended by other features) land in the
flat `blocks` column only and are **not** reflected back into `bs_snapshot`. This
is acceptable for v1 because artifact integration is out of scope; reconciliation
(flat append → snapshot merge) is designed when artifact blocks are added.

---

## 8. File Plan (frontend)

```
src/app/components/notebook-v2/
  NotebookShell.tsx            (rewrite) paper surface + editor mount + toolbar + nav
  ReadingMode.tsx              (new)     read-only two-page spread from snapshot
  OutlineSidebar.tsx           (update)  derive outline from Doc block tree
  PageNavigation.tsx           (update)  page-break-aware nav
  BlockToolbar.tsx             (update)  paper-ui buttons → doc.addBlock
  editor/
    useBlockSuiteEditor.ts     (new)     collection/doc/editor lifecycle
    specs.ts                   (new)     native + scholar:* spec registration
    ReactEmbedBlock.ts         (new)     Lit base hosting a React root
  blocks/                      (rewrite) React views for scholar:* blocks
    CalloutView.tsx
    StickyNoteView.tsx
    DiagramView.tsx            (reuse existing mermaid logic)
    PageBreakView.tsx
  deferred/                    (moved)   ai-answer/table/whiteboard/flashdeck/quiz — unregistered
src/app/lib/
  notebook-v2.types.ts         (update)  scholar:* prop types
  blocksuite/
    api.ts                     (new)     single barrel re-exporting the BlockSuite symbols we use
    schemas.ts                 (new)     defineBlockSchema for scholar:* blocks
    persistence.ts             (new)     doc ↔ snapshot envelope (docToEnvelope / envelopeToDoc)
    project-flat.ts            (new)     projectSnapshotToFlat: Doc → legacy flat blocks array
    migrate-legacy.ts          (new)     legacyBlocksToSnapshot: flat-blocks → Doc/snapshot
src/app/stores/useNotebookV2Store.ts  (rewrite) UI-only state
```

Backend: add nullable `bs_snapshot` JSON column to the `Notebook` model and
accept it in `NotebookPatch` / `update_notebook`. No consumer rewrite — `blocks`
still carries the flat projection.

---

## 9. Testing

- **Migration**: legacy flat-blocks → Doc maps every v1 type; dropped types
  preserve text as paragraphs; metadata sticky notes become standalone blocks.
- **Round-trip**: `doc → snapshot → doc` is stable (structure + props).
- **Text extraction**: snapshot → plain text covers native + `scholar:*` blocks
  (backend dedup/RAG input unchanged in shape).
- **Block views**: each `scholar:*` React view renders from `model` and writes
  edits back via `doc.updateBlock`.
- **Integration**: mount editor → insert each v1 flavour via toolbar → autosave
  fires → reload restores identical content; Reading mode paginates by markers.

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| BlockSuite package/API churn vs docs | Pin one version; verify export names before coding; isolate all BlockSuite calls behind `editor/` + `lib/blocksuite/` |
| React-in-Lit lifecycle leaks | Single `ReactEmbedBlock` base owns create/unmount; test mount/unmount |
| Reading-mode height pagination imperfect | Ship marker-based paging first; height-splitting is best-effort and read-only, so imperfect breaks are low-risk |
| Backend depends on flat `blocks` array | Dual-store: keep `blocks` as a projection regenerated on save; snapshot lives in new `bs_snapshot` column (§7) |
| Snapshot/flat divergence via `append_block` | v1 limitation (§7.5); artifacts out of scope; reconciliation designed when artifact blocks land |
| Losing deferred block code | Move to `deferred/` unregistered, not delete |

---

## 11. Out of Scope (v1)

Real-time collaboration, ai-answer block, table/whiteboard/flashcard/quiz
artifact blocks, PDF snippet, mindmap, charts, difference table, cross-linking,
per-module search index, and all "future module types" from the source
architecture. Each returns later via the established embed pattern.
