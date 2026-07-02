import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCard, PaperPanel, MarkerHighlight, SketchBorder } from '@paper-ui/core'
import { StarDoodle, PushPinDoodle } from '../../../../paper-ui/src/components/doodles'
import { Tape } from '../../../../paper-ui/src/components/decorations'

const meta: Meta<typeof PaperCard> = {
  title: 'Components/Wrappers/PaperCard',
  component: PaperCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Paper Card

The fundamental surface component of Paper UI — a single hand-drawn rough.js shape providing a warm fill, wobbly outline, and crisp hard-offset shadow. Designed for notebook-style interfaces.

### Key characteristics
- Hand-drawn borders via **SketchBorder** (rough.js SVG)
- Hard-offset drop shadow in four levels: none / sm / md / lg
- Optional paper fiber/noise texture overlay
- Subtle lift-on-hover interaction
- Slight rotation for intentional imperfection

### Installation
\`\`\`bash
npm install @paper-ui/core
\`\`\`

### Import
\`\`\`tsx
import { PaperCard, PaperPanel } from '@paper-ui/core'
\`\`\`

### Variants
- **PaperCard** — Main card surface, warm fill (#fffdf9), configurable shadow, texture enabled
- **PaperPanel** — Lighter variant, stroke-only outline, transparent fill, no shadow, no texture`,
      },
    },
  },
  argTypes: {
    surface: {
      description: 'Surface fill color. Use a concrete hex value (no CSS var).',
      control: 'color',
      table: { defaultValue: { summary: '#fffdf9' } },
    },
    shadow: {
      description: 'Shadow offset depth. none=0px, sm=2px, md=3px, lg=4px.',
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
    },
    lift: {
      description: '2px upward lift on hover. Adds tactile, physical feel.',
      table: { defaultValue: { summary: 'false' } },
    },
    texture: {
      description: 'Paper fiber/noise overlay via .paper-texture CSS class.',
      table: { defaultValue: { summary: 'true' } },
    },
    rotate: {
      description: 'Extra rotation in degrees. Keep small (1–3°) for intentional imperfection.',
      control: { type: 'number', min: -5, max: 5, step: 0.5 },
    },
    border: {
      description: 'Props forwarded to the underlying SketchBorder. Pass `null` to disable.',
      control: 'object',
    },
    className: {
      description: 'Additional CSS classes. Use Tailwind utilities (p-4, w-56, etc.) for sizing and spacing.',
    },
    children: {
      description: 'Card contents. Any React node.',
    },
  },
}

export default meta
type Story = StoryObj<typeof PaperCard>

export const Default: Story = {
  args: { shadow: 'md', className: 'p-4 w-56' },
  parameters: {
    docs: {
      description: {
        story: 'A basic paper surface with hand-drawn border, medium shadow, and texture.',
      },
    },
  },
  render: (args) => (
    <PaperCard {...args}>
      <p className="font-kalam text-sm text-ink">A warm paper surface with a hand-drawn border.</p>
    </PaperCard>
  ),
}

export const ShadowVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Four shadow levels controlling the offset distance of the rough.js drop shadow. **none** removes shadow entirely, **lg** provides the deepest depth for featured cards.',
      },
    },
  },
  render: () => (
    <div className="flex gap-6 flex-wrap items-start">
      {(['none', 'sm', 'md', 'lg'] as const).map((s) => (
        <PaperCard key={s} shadow={s} className="p-4 w-36">
          <p className="font-architect text-xs text-ink-muted uppercase tracking-widest mb-1">{s}</p>
          <p className="font-kalam text-sm text-ink">shadow={s}</p>
        </PaperCard>
      ))}
    </div>
  ),
}

export const WithLift: Story = {
  args: { shadow: 'md', lift: true, className: 'p-4 w-48' },
  parameters: {
    docs: {
      description: {
        story: 'The **lift** prop adds a subtle 2px upward movement on hover. Cards feel physically raised from the page when the cursor passes over them.',
      },
    },
  },
  render: (args) => (
    <PaperCard {...args}>
      <p className="font-kalam text-sm text-ink">Hover to see lift effect.</p>
    </PaperCard>
  ),
}

export const Rotated: Story = {
  args: { shadow: 'md', rotate: -2, className: 'p-4 w-48' },
  parameters: {
    docs: {
      description: {
        story: 'Slight rotation creates an intentionally imperfect, pinned-notebook aesthetic. Keep values small (1–3°) — larger angles harm readability.',
      },
    },
  },
  render: (args) => (
    <div className="p-8">
      <PaperCard {...args}>
        <p className="font-kalam text-sm text-ink">Slightly tilted note.</p>
      </PaperCard>
    </div>
  ),
}

export const Panel: Story = {
  parameters: {
    docs: {
      description: {
        story: '**PaperPanel** is a lighter inner surface — stroke-only outline, transparent body, no shadow, no texture. Ideal for section groupings within a card.',
      },
    },
  },
  render: () => (
    <PaperPanel className="p-4 w-48">
      <p className="font-kalam text-sm text-ink">Stroke-only inner panel.</p>
    </PaperPanel>
  ),
}

export const WithDecorations: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

PaperCard layers with decorative components to create rich notebook layouts.

### Common combinations
- **Tape** — Masking-tape strips across corners, with configurable rotation and width
- **PushPin** — Push-pin or thumbtack decorations with doodle SVG
- **MarkerHighlight** — Highlighter-marker sweeps behind inline text
- **PaperPanel** — Nested stroke-only inner surfaces for content grouping

\`\`\`tsx
import { PaperCard } from '@paper-ui/core'
import { Tape, PushPin } from '@paper-ui/components/decorations'
\`\`\`

### Accessibility
- Renders a \`<div>\` — add \`role="button" tabIndex={0}\` for clickable cards
- SVG borders are decorative (\`aria-hidden="true"\`)
- Content should follow logical heading hierarchy

### Design Guidelines
- **When to use:** discrete content blocks, notebook-style layouts, any surface needing hand-drawn character
- **When not to use:** data tables (use PaperTable), full-page layouts (use Paper), modals (use PaperModal), buttons (use PaperButton)
- **Spacing:** Use Tailwind utilities — \`p-4\` / \`p-5\` for padding, \`gap-4\` in flex/grid parents
- **Shadow:** \`shadow="md"\` for most cards, \`shadow="lg"\` for featured/hero
- **Dark mode:** CSS custom properties in \`.dark\` class handle color adaptation automatically

### Related Components
- **SketchBorder** — The underlying rough.js border primitive
- **PaperSheetCard** — Grid-paper styled card with fold and hole punch
- **PaperSheetBorder** — Notebook-paper edge with torn-line effect
- **PaperIconCircle** — Hand-drawn icon circle container
- **MarkerHighlight** — Highlighter-marker sweep across text`,
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <PaperCard shadow="md" rotate={-1} className="relative">
        <div className="absolute -top-2 left-3 z-20">
          <Tape corner="top-left" width={34} rotate={-24} />
        </div>
        <div className="absolute -top-2 right-3 z-20">
          <Tape corner="top-right" width={34} rotate={24} />
        </div>
        <div className="p-5">
          <h3 className="font-architect text-base text-ink mb-2">Taped Note</h3>
          <p className="font-kalam text-sm text-ink-muted">Masking-tape strips holding this card in place.</p>
        </div>
      </PaperCard>

      <PaperCard shadow="lg" className="p-5 relative">
        <div className="absolute -top-5 -right-3 z-20 rotate-12">
          <PushPinDoodle size={32} color="#c9954f" />
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <StarDoodle size={20} color="#c9954f" />
          </div>
          <div>
            <h3 className="font-architect text-base text-ink mb-1">Pinned Card</h3>
            <p className="font-kalam text-sm text-ink">
              A <MarkerHighlight color="#f6e27a">push-pin</MarkerHighlight> doodle and star accent give this card personality.
            </p>
          </div>
        </div>
      </PaperCard>

      <PaperCard shadow="sm" className="p-4">
        <h3 className="font-architect text-base text-ink mb-3">Nested Panels</h3>
        <PaperPanel className="p-3">
          <p className="font-kalam text-sm text-ink">Content grouped in a stroke-only inner panel.</p>
        </PaperPanel>
      </PaperCard>
    </div>
  ),
}
