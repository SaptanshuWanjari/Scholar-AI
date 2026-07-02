import React, { type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchBorder } from '@paper-ui/core'

const meta: Meta<typeof SketchBorder> = {
  title: 'Components/Wrappers/SketchBorder',
  component: SketchBorder,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Sketch Border

The lowest-level visual primitive in Paper UI. Renders a single hand-drawn rectangle using **rough.js** — generating SVG paths with a sketchy, hand-drawn aesthetic. Every paper surface (PaperCard, PaperPanel, PaperToast, buttons, inputs) is built on SketchBorder.

Auto-sizes to its parent container via a \`ResizeObserver\`.

### Import
\`\`\`tsx
import { SketchBorder } from '@paper-ui/core'
\`\`\``,
      },
    },
  },
  argTypes: {
    fill: {
      description: 'Fill color for the rough.js shape (CSS color string).',
      control: 'color',
    },
    fillStyle: {
      description: 'rough.js fill style. solid, hachure, cross-hatch, etc.',
      control: 'select',
      options: ['solid', 'hachure', 'cross-hatch', 'zigzag', 'dashed'],
    },
    stroke: {
      description: 'Stroke color (CSS color string).',
      control: 'color',
      table: { defaultValue: { summary: '#222222' } },
    },
    strokeWidth: {
      description: 'Stroke width in px.',
      control: { type: 'number', min: 0.5, max: 10, step: 0.5 },
      table: { defaultValue: { summary: '1.5' } },
    },
    roughness: {
      description: 'Roughness factor. 0 = perfect lines, 5 = extremely wobbly. Recommended range: 0.9–1.5 for readable UIs.',
      control: { type: 'number', min: 0, max: 5, step: 0.1 },
      table: { defaultValue: { summary: '1.1' } },
    },
    radius: {
      description: 'Corner radius in px. Pass containerWidth/2 for a rough circle.',
      control: { type: 'number', min: 0, max: 100, step: 1 },
    },
    shadow: {
      description: 'Hard-offset shadow distance in px. Drawn as a second rough.js shape.',
      control: { type: 'number', min: 0, max: 10, step: 1 },
    },
    bleed: {
      description: 'Positive margin in px to prevent clipping of rough strokes.',
      control: { type: 'number', min: 0, max: 20, step: 1 },
      table: { defaultValue: { summary: '4' } },
    },
  },
}

export default meta
type Story = StoryObj<typeof SketchBorder>

function Wrapper({ children, ...args }: ComponentProps<typeof SketchBorder> & { children?: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: 240, height: 80 }}>
      <SketchBorder {...args} />
      <span className="relative z-10 text-sm font-architect text-ink">{children ?? 'Sketch border'}</span>
    </div>
  )
}

export const Default: Story = {
  args: { roughness: 1.1, strokeWidth: 1.5 },
  parameters: { docs: { description: { story: 'A minimal sketch border — no fill, thin stroke, moderate roughness.' } } },
  render: (args) => <Wrapper {...args} />,
}

export const WithFill: Story = {
  args: { roughness: 1.1, strokeWidth: 1.5, fill: '#fffdf9' },
  parameters: { docs: { description: { story: 'Add a \`fill\` color for a solid paper surface behind the content.' } } },
  render: (args) => <Wrapper {...args}>Filled surface</Wrapper>,
}

export const Heavy: Story = {
  args: { roughness: 2.5, strokeWidth: 3, stroke: '#222222' },
  parameters: { docs: { description: { story: 'Increase roughness and stroke width for a more pronounced hand-drawn look. Use for decorative borders, not data UI.' } } },
  render: (args) => <Wrapper {...args}>Heavy stroke</Wrapper>,
}

export const WithShadow: Story = {
  args: { roughness: 1, strokeWidth: 1.5, fill: '#fffdf9', shadow: 3 },
  parameters: { docs: { description: { story: 'Hard-offset drop shadow adds depth. The shadow is a second rough.js shape offset by the \`shadow\` px value.' } } },
  render: (args) => <Wrapper {...args}>With shadow</Wrapper>,
}

export const Hachure: Story = {
  args: { roughness: 1, fill: '#d4e6d4', fillStyle: 'hachure', fillWeight: 1.5, hachureGap: 5 },
  parameters: { docs: { description: { story: 'Instead of a solid fill, use cross-hatching (\`fillStyle="hachure"\`) for a sketch-like shading effect.' } } },
  render: (args) => <Wrapper {...args}>Hachure fill</Wrapper>,
}

export const CircleVariant: Story = {
  parameters: { docs: { description: { story: 'Set \`radius\` to half the container width for a rough, hand-drawn circle. Perfect for icon wrappers and badges.' } } },
  render: () => (
    <div className="flex gap-4 items-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: 64, height: 64 }}>
        <SketchBorder fill="#e7efe4" stroke="#5a825a" strokeWidth={1.5} roughness={0.9} radius={32} />
        <span className="relative z-10 text-2xl">A</span>
      </div>
      <div className="relative inline-flex items-center justify-center" style={{ width: 48, height: 48 }}>
        <SketchBorder fill="#faf3e3" stroke="#b0882a" strokeWidth={1.3} roughness={1.0} radius={24} />
        <span className="relative z-10 text-lg">B</span>
      </div>
      <div className="relative inline-flex items-center justify-center" style={{ width: 36, height: 36 }}>
        <SketchBorder fill="#fae8e8" stroke="#9a4a4a" strokeWidth={1.2} roughness={1.1} radius={18} shadow={1} />
        <span className="relative z-10 text-sm">C</span>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

SketchBorder is the foundation of nearly every Paper UI component. It renders a purely decorative SVG (\`aria-hidden="true"\`).

### Usage Pattern
\`\`\`tsx
<div className="relative" style={{ width: 260, height: 140 }}>
  <SketchBorder fill="#fffdf9" shadow={3} roughness={1.2} />
  <div className="relative z-[1] p-5">
    <p className="font-kalam text-sm text-ink">Content goes here.</p>
  </div>
</div>
\`\`\`

### Design Guidelines
- Always wrap in a \`relative\` container — the SVG fills the parent
- Content needs \`z-[1]\` or higher to sit above the SVG
- Recommended roughness: 0.9–1.5 for UIs, 2–3 for decorative surfaces
- Set \`bleed\` to at least \`strokeWidth * 2\` to avoid clipped edges
- For circles, set \`radius\` to half the container width

### Related Components
- **PaperCard** — Full paper surface built on SketchBorder
- **PaperSheetBorder** — Notebook-paper edge with torn-line effect`,
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div className="relative inline-flex items-center justify-center" style={{ width: 300, height: 100 }}>
        <SketchBorder fill="#fffdf9" shadow={3} roughness={1.2} strokeWidth={1.5} />
        <div className="relative z-10 p-5 text-center">
          <p className="font-architect text-sm text-ink font-bold">Custom Surface</p>
          <p className="font-kalam text-xs text-ink-muted mt-1">Content layered above the SVG</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="relative" style={{ width: 180, height: 60 }}>
          <SketchBorder stroke="#b4ad9e" strokeWidth={1.4} roughness={1.0} radius={6} />
          <div className="relative z-10 p-3">
            <p className="font-architect text-xs text-ink-muted">Input border</p>
          </div>
        </div>
        <div className="relative" style={{ width: 180, height: 60 }}>
          <SketchBorder fill="#fdf0ef" stroke="#9f3a36" strokeWidth={1.5} roughness={1.1} radius={6} shadow={2} />
          <div className="relative z-10 p-3">
            <p className="font-architect text-xs" style={{ color: '#9f3a36' }}>Error state</p>
          </div>
        </div>
      </div>
    </div>
  ),
}
