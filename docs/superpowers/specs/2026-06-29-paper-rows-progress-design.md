# Paper Library — Rows & Progress Components

**Date:** 2026-06-29  
**Scope:** `frontend/src/app/components/paper/rows/` and `frontend/src/app/components/paper/progress/`  
**Constraint:** UI library only — no routing, no API calls, no Zustand stores, no domain types.

---

## Context

The `paper/` component library uses rough.js (`SketchBorder`) for all drawn surfaces and a fixed set of handwritten fonts (`font-kalam`, `font-architect`, `font-caveat`) and tones (`IconTone`). Three row components already exist (`DocumentRow`, `StatRow`, `SessionRow`). This spec adds the remaining 8 rows and 5 progress components.

---

## Shared API Conventions

Every new component follows these rules:

- **No domain coupling** — props named `title`, `meta`, `badge`, `icon`, `actions`; never `course: Course` or API types.
- **`actions?: ReactNode`** — caller-supplied slot, revealed on hover via `opacity-0 group-hover:opacity-100` (same pattern as `DocumentRow`).
- **`badge?: ReactNode`** — any pill/tag the caller supplies; components don't hardcode badge content.
- **`onClick?: () => void`** — for rows that are interactive.
- **Fonts** — `font-kalam` for body text, `font-architect` for metadata/dates, `font-caveat` for numbers/values.
- **Tones** — `IconTone` from `PaperIconCircle` (`sage | ochre | sky | lavender | brick | ink`).
- **Colors** — concrete hex values only in rough.js attributes (no CSS vars).

---

## Rows

All rows live in `frontend/src/app/components/paper/rows/` and are barrel-exported from `index.ts`.

### CourseRow

```ts
interface CourseRowProps {
  color?: string;        // accent hex for avatar bg tint
  initials?: string;     // 1-2 chars shown in avatar
  title: string;
  meta?: string;         // e.g. "12 docs · 48 cards"
  badge?: ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  actions?: ReactNode;   // hover-revealed slot (rename, delete, etc.)
}
```

Anatomy: Color-tinted avatar circle (rough.js fill at 15% opacity, stroke at 35%) with `initials` in `font-kalam font-bold`. Title + `meta` text block. Left vertical accent line (2px, `color`) when `isSelected`. `actions` slot fades in on hover.

---

### ArtifactRow

```ts
interface ArtifactRowProps {
  icon: ReactNode;
  tone?: IconTone;       // default "ink"
  title: string;
  badge?: ReactNode;     // type label (caller supplies PaperBadge)
  date?: string;
  actions?: ReactNode;
}
```

Anatomy: `PaperIconCircle` left, title + `badge` in the middle, `date` in `font-architect` + `actions` right.

---

### FlashcardRow

```ts
interface FlashcardRowProps {
  front: string;
  back: string;
  badge?: ReactNode;     // card type chip (MCQ, T/F, etc.)
  meta?: string;         // deck name or due date
  actions?: ReactNode;
}
```

Anatomy: `badge` left, truncated `front` as primary text, `back` as secondary muted line, `meta` in `font-architect` right, `actions` slot.

---

### QuizRow

```ts
interface QuizRowProps {
  title: string;
  count?: string;        // e.g. "12 questions"
  badge?: ReactNode;     // difficulty badge
  score?: string;        // e.g. "85%" — rendered in font-caveat
  actions?: ReactNode;
  onClick?: () => void;
}
```

Anatomy: Title + `count` meta, `badge`, `score` in `font-caveat text-[24px]`, `actions` slot.

---

### TimelineRow

```ts
interface TimelineRowProps {
  label: string;
  sublabel?: string;
  status?: 'done' | 'active' | 'pending';  // default "pending"
  isLast?: boolean;
}
```

Anatomy: Vertical dot-connector layout. Dot: filled circle (sage) = done, ink-outlined circle = active, muted ring = pending. Connector line hidden when `isLast`. `label` styled: strikethrough + muted = done, `font-bold text-ink` = active, `text-ink-muted` = pending. `sublabel` always muted beneath.

---

### ConceptRow

```ts
interface ConceptRowProps {
  title: string;
  description?: string;
  indicator?: ReactNode; // mastery dot, status icon, or similar
  badge?: ReactNode;     // difficulty, status badge
  meta?: string;         // time estimate, prereq count, etc.
  actions?: ReactNode;   // status selector, action buttons
  onClick?: () => void;
}
```

Anatomy: `indicator` + title + `description` left block; `badge` + `meta` right-aligned; `actions` renders below the row on hover (flex-wrap). Horizontal layout, no border — caller wraps in `PaperPanel` or plain `div` as needed.

---

### SearchResultRow

```ts
interface SearchResultRowProps {
  title: string;
  badge?: ReactNode;    // course, category, or type label
  snippet?: ReactNode;  // pre-highlighted content (caller handles highlight markup)
  onClick?: () => void;
}
```

Anatomy: Full-width clickable surface with a light hover tint (`hover:bg-black/[0.025]`). Title + `badge` top line, `snippet` below in `font-kalam text-sm text-ink-muted`. No rough.js border — keeps list rendering fast.

---

### PluginRow

```ts
interface PluginRowProps {
  icon: ReactNode;
  title: string;
  description?: string;
  meta?: ReactNode;      // version chip, "Built-in" badge, etc.
  control?: ReactNode;   // toggle switch or any control
  expanded?: ReactNode;  // settings panel rendered below when truthy
}
```

Anatomy: `PaperIconCircle` (tone="ink") left, title + `meta` + description block, `control` right. When `expanded` is truthy, renders below with a `SketchDivider variant="dashed"` separator and slight top margin.

---

## Progress

All progress components live in `frontend/src/app/components/paper/progress/` and are barrel-exported from `index.ts`.

### CircularProgress

```ts
interface CircularProgressProps {
  value: number;          // 0–100
  size?: number;          // default 80
  strokeWidth?: number;   // default 8
  color?: string;         // fill arc color, default "#7fa37b"
  label?: string;         // small text below percentage
  className?: string;
}
```

Implementation: SVG with two rough.js arcs drawn via `rc.arc()`. Track arc = full 360° in muted tone. Fill arc = proportional to `value`. Roughness 0.6 (low — arcs must read cleanly). Percentage in `font-caveat font-bold` at center. Optional `label` in `font-architect text-xs` below the SVG.

---

### StepProgress

```ts
interface StepProgressProps {
  steps: string[];
  current: number;   // 0-based; steps[current] is active
  className?: string;
}
```

Implementation: Horizontal flex row. Each step: numbered circle (done = `PaperIconCircle tone="sage"` with checkmark, active = `tone="ink"` outlined, pending = muted ring) + label below in `font-architect text-xs`. Connecting lines between circles via `SketchDivider variant="straight"` sized to fill the gap.

---

### LearningProgress

```ts
interface LearningProgressProps {
  value: number;         // 0–100 fed to SketchProgress
  done?: string;         // e.g. "12 concepts"
  total?: string;        // e.g. "20 concepts"
  label?: string;        // section header text
  sublabel?: string;     // secondary header line
  color?: string;        // forwarded to SketchProgress
  className?: string;
}
```

Implementation: Optional `SectionLabel` header. `SketchProgress` bar. Below the bar: `done` left-aligned in `font-architect text-sm text-ink`, `total` right-aligned muted. A thin labeled shell around the existing bar primitive.

---

### TimelineProgress

```ts
interface TimelineProgressStage {
  label: string;
  sublabel?: string;
  percent?: number;                            // 0–100; renders mini SketchProgress if provided
  status?: 'done' | 'active' | 'pending';
}

interface TimelineProgressProps {
  stages: TimelineProgressStage[];
  className?: string;
}
```

Implementation: Vertical stack. Each stage: bullet dot (same status styling as `TimelineRow`) + label + optional `sublabel` + optional mini `SketchProgress` (height=8, muted for done, colored for active). Connector line between stages. Dot/line status styling is implemented inline (same pattern as `TimelineRow`, not extracted — no shared utility needed).

---

### StageProgress

```ts
interface StageProgressProps {
  title: string;
  value: number;        // 0–100
  sublabel?: string;    // e.g. "4 / 6 concepts"
  color?: string;
  className?: string;
}
```

Implementation: Title left + rough-outlined `value%` chip right (uses `SketchBorder stroke-only` wrapping a small `font-caveat` span). `SketchProgress` bar below. `sublabel` in `font-architect text-xs text-ink-muted` beneath the bar. Compact — designed to sit inside a card header.

---

## File Structure

```
paper/
  rows/
    CourseRow.tsx       ← new
    ArtifactRow.tsx     ← new
    FlashcardRow.tsx    ← new
    QuizRow.tsx         ← new
    TimelineRow.tsx     ← new
    ConceptRow.tsx      ← new
    SearchResultRow.tsx ← new
    PluginRow.tsx       ← new
    DocumentRow.tsx     ← existing, untouched
    StatRow.tsx         ← existing, untouched
    SessionRow.tsx      ← existing, untouched
    index.ts            ← add new exports
  progress/
    SketchProgress.tsx      ← existing, untouched
    CircularProgress.tsx    ← new
    StepProgress.tsx        ← new
    LearningProgress.tsx    ← new
    TimelineProgress.tsx    ← new
    StageProgress.tsx       ← new
    index.ts                ← add new exports
  index.ts                  ← already re-exports rows/* and progress/*
```

---

## Out of Scope

- No stories, demos, or Storybook setup.
- No changes to any page component (`pages/`).
- No modifications to existing row/progress files.
- No new routes or navigation.
