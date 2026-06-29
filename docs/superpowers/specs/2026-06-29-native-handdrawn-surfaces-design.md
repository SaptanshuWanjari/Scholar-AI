# Native Hand-Drawn Surfaces — Foundation Refactor

**Date:** 2026-06-29
**Scope:** `frontend/src/app/components/paper/` foundation + the dashboard surfaces that
visibly show the bug. Mock-data dev page only (`/dashboard-clone`). Production components
(`Dashboard.tsx`, `AppLayout`, shared `ui/`) untouched.

## Problem

Every card and button currently renders **two overlapping silhouettes**:

1. A **crisp modern rectangle** — the wrapper `<div>` has `rounded-[8px]` + a solid
   `backgroundColor` + a hard CSS `boxShadow`. This produces a perfectly geometric rounded-rect
   edge, and the shadow traces that perfect rectangle.
2. A **hand-drawn rectangle** — the rough.js SVG stroke is drawn **inset** by
   `pad = strokeWidth + 1` (~2.5px) *inside* that crisp rect.

Result: the clean fill-rect edge + clean shadow read as a "modern card," with a wobbly pencil line
floating ~2.5px inside it. Visible on every `PaperCard`, every `PaperButton`
("View All Paths" / "Continue"), the "Next up" box, and the icon chip (which uses a literal CSS
`border-[1.5px]`).

A native hand-drawn UI (Excalidraw / tldraw, the reference) draws the shape as **one rough.js path
that provides fill AND stroke together** — no CSS rounded-rect or box-shadow underneath, so there
is a single wobbly silhouette and the shadow follows that same wobble.

## Decisions (confirmed with user)

- **rough.js owns the card body**: a single rough path draws fill + stroke; the wrapper loses its
  CSS `rounded` / `background` / `box-shadow`.
- **Shadow** is drawn with CSS `filter: drop-shadow(Xpx Xpx 0 rgba(0,0,0,α))` on the rough SVG, so
  it traces the actual hand-drawn edge, hard (0 blur).

## Design

### 1. Core primitive — `SketchBorder` becomes a surface (`foundation/SketchBorder.tsx`)

Evolve the existing primitive (keep the export name for import compatibility; add a
`SketchSurface` alias) to draw the full surface, aligned exactly to the parent's box:

- **Oversized SVG with bleed.** Host renders at `inset: -BLEED` (BLEED ≈ 8px), so the SVG covers
  parent size + `2*BLEED`. This gives the `drop-shadow` filter and the roughness wobble room and
  prevents clipping. The rough rounded-rect is drawn at the parent's *actual* box edges (offset by
  BLEED inside the oversized SVG), so the visible silhouette lines up with the layout box and
  **existing component paddings keep working unchanged**.
- **Fill + stroke in one path:**
  `rc.path(d, { fill, fillStyle: 'solid', stroke, strokeWidth, roughness, bowing, seed })`.
  When `fill` is provided it becomes the card background (no CSS background needed). When omitted,
  the path is stroke-only (inner panels).
- **Shadow:** `filter: drop-shadow(${shadow}px ${shadow}px 0 rgba(0,0,0,α))` applied to the `<svg>`;
  `shadow = 0` disables it.
- **New props:** `fill`, `shadow` (offset px), `bleed`. Existing props
  (`stroke`, `strokeWidth`, `roughness`, `bowing`, `radius`, `seed`) unchanged.
- Stays `pointer-events-none absolute`, drawn behind content (content remains `z-[1]`). Seed stays
  stable per instance so it does not re-jitter on resize.
- ResizeObserver path is unchanged except the host is sized to parent + `2*BLEED`.

### 2. `PaperCard` / `PaperPanel` (`foundation/Paper.tsx`)

- Remove `rounded-[8px]`, `backgroundColor`, and the `boxShadow` (`SHADOWS` map) from the wrapper.
- Wrapper becomes a transparent positioning box (`relative`, keeps `texture` / `lift`).
- `surface` is forwarded to `SketchBorder` as `fill`; the `shadow` prop maps to an offset px value
  (`sm`≈2, `md`≈3, `lg`≈4) passed to `SketchBorder`.
- `PaperPanel` = stroke-only (transparent fill, no shadow) for inner boxes.

### 3. Buttons (`buttons/Buttons.tsx`)

- `PaperButton`: remove `rounded-[8px]`, `backgroundColor`, `boxShadow`. The tone's `bg` becomes the
  rough `fill`, the tone's `stroke` becomes the rough stroke, shadow offset ≈ 2px.
- Dark "Ask AI" = rough solid `#262320` fill with light text. Press animation
  (`hover:-translate-y-px active:translate-y-[1px]`) unchanged.
- `SketchButton` / `StickyButton` / `IconButton` inherit the fix (IconButton is borderless — no
  change beyond confirming it has no crisp underlay).

### 4. Inner-box cleanups (`cards/ContinueLearningCard.tsx`)

- "Next up" box: replace the `rounded-[10px]` div wrapping a nested `PaperCard` (two silhouettes)
  with a single `PaperPanel` (stroke-only, light `#cfc8b8`).
- Icon chip: replace the literal `border-[1.5px] border-ink/70` with a small stroke-only
  `SketchBorder` so it is hand-drawn.

### 5. Audit pass on remaining surfaces

Convert any remaining crisp-rect-under-sketch the same way in: `progress/SketchProgress.tsx`,
`inputs/SketchSearch.tsx`, `decorations/StickyNote.tsx`, `foundation/PaperIconCircle.tsx`,
`badges/PaperBadge.tsx`. Lightly clip / inset the `.paper-texture` overlay in `globals.css` so the
noise does not spill past the wobbly edge.

## Out of scope

- No changes to `DashboardClone.tsx` or `dashboard-clone.mock.ts` (page + data stay as-is).
- No production component changes.
- No new dependencies (rough.js already installed).

## Verification

1. `cd frontend && npm run dev`, visit `/dashboard-clone`.
2. Confirm each card/button has **one** silhouette — no clean rounded-rect edge or clean shadow
   peeking outside the hand-drawn stroke.
3. Shadows are hard offset and follow the wobble (not a perfect rectangle).
4. Inner "Next up" box and icon chip are single hand-drawn outlines; no literal CSS borders remain.
5. Hover: cards lift 2px, buttons press, no silhouette artifacts on transition.
6. `npm run build` succeeds; `git diff` is scoped to `paper/` foundation + `globals.css` (no page,
   mock, or production changes).
