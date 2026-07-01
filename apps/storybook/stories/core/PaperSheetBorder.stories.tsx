import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetBorder } from '@paper-ui/core'
import { Tape } from '../../../../paper-ui/src/components/decorations'

const meta: Meta<typeof PaperSheetBorder> = {
  title: 'Core/PaperSheetBorder',
  component: PaperSheetBorder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Paper Sheet Border

Renders a ruled notebook-paper edge using a single hand-drawn SVG. Draws a rectangular frame with a subtle bottom-right fold, optional drop shadow, and a notched left-edge tear detail — evoking a torn-out notebook page. The SVG auto-scales to fill its parent container.

Part of the notebook-paper family alongside **PaperSheetCard** (which wraps this with ruled lines and a content area).

### Import
\`\`\`tsx
import { PaperSheetBorder } from '@paper-ui/core'
\`\`\``,
      },
    },
  },
  argTypes: {
    fill: {
      description: 'Background fill color. CSS color string.',
      control: 'color',
      table: { defaultValue: { summary: '#fffdf9' } },
    },
    shadow: {
      description: 'Hard-offset shadow distance in px. Pass 0 to disable.',
      control: { type: 'number', min: 0, max: 8, step: 1 },
      table: { defaultValue: { summary: '2' } },
    },
    fold: {
      description: 'Draw the bottom-right folded corner detail with ink lines and drop shadow.',
      table: { defaultValue: { summary: 'false' } },
    },
    className: {
      description: 'Additional CSS classes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof PaperSheetBorder>

function Sheet(props: ComponentProps<typeof PaperSheetBorder> & { label?: string }) {
  const { label, ...rest } = props
  return (
    <div className="relative" style={{ width: 260, height: 140 }}>
      <PaperSheetBorder {...rest} />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="font-architect text-sm text-ink">{label ?? 'Paper sheet'}</span>
      </div>
    </div>
  )
}

export const Default: Story = {
  parameters: { docs: { description: { story: 'A basic notebook-paper edge with fill and shadow. No fold — clean rectangular sheet.' } } },
  render: () => <Sheet />,
}

export const WithFold: Story = {
  parameters: { docs: { description: { story: 'The \`fold\` prop adds the bottom-right folded corner — ink lines fanning out from the corner with a subtle drop shadow.' } } },
  render: () => <Sheet fold label="With fold" />,
}

export const CustomFill: Story = {
  parameters: { docs: { description: { story: 'Change fill color for different paper tones. Try sticky yellow (#fdf3b8), graph blue, or kraft brown.' } } },
  render: () => <Sheet fill="#fdf3b8" label="Sticky yellow" />,
}

export const NoShadow: Story = {
  parameters: { docs: { description: { story: 'Disable the drop shadow with \`shadow={0}\` for a flat, inline appearance.' } } },
  render: () => <Sheet shadow={0} label="No shadow" />,
}

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

PaperSheetBorder is a primitive used internally by PaperSheetCard. Use it directly when you need the notebook-paper edge without ruled lines or title band.

### Usage Pattern
\`\`\`tsx
<div className="relative" style={{ width: 280, height: 160 }}>
  <PaperSheetBorder fill="#fffdf9" shadow={2} fold />
  <div className="relative z-10 p-5">
    <p className="font-kalam text-sm text-ink">Torn notebook page with content.</p>
  </div>
</div>
\`\`\`

### Design Guidelines
- **When to use:** Notebook-style card components, torn-paper effects, paper-themed headers/dividers
- **When not to use:** For circular shapes (use SketchBorder), dense data tables, dark backgrounds
- Parent container must have defined width — SVG fills the container
- Use \`fold\` for standalone cards; omit for inline/embedded surfaces
- Content should have \`z-[10]\` or higher to sit above the SVG

### Related Components
- **PaperSheetCard** — Full notebook page with ruled lines and title band
- **SketchBorder** — General-purpose rough.js border primitive
- **PaperCard** — Solid paper surface with hand-drawn border`,
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div className="relative" style={{ width: 300, height: 120 }}>
        <PaperSheetBorder fill="#fffdf9" shadow={3} fold />
        <div className="relative z-10 p-5">
          <p className="font-architect text-sm text-ink font-bold">Recipe Card</p>
          <p className="font-kalam text-xs text-ink-muted mt-1">Ingredients: eggs, flour, butter, vanilla</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="relative" style={{ width: 160, height: 100 }}>
          <PaperSheetBorder fill="#fdf3b8" shadow={2} />
          <div className="relative z-10 p-3">
            <p className="font-caveat text-sm text-ink">Sticky note</p>
          </div>
        </div>
        <div className="relative" style={{ width: 160, height: 100 }}>
          <PaperSheetBorder fill="#e8f0fe" shadow={1} />
          <div className="relative z-10 p-3">
            <p className="font-caveat text-sm text-ink">Graph paper</p>
          </div>
        </div>
      </div>
    </div>
  ),
}
