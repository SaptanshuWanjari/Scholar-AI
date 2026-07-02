import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperIconCircle } from '@paper-ui/core'
import type { IconTone } from '@paper-ui/core'
import { BookOpen, Star, Zap, Heart, Flame, Pencil, Brain, MessageSquare, Settings } from 'lucide-react'

const TONE_LABELS: Record<IconTone, { label: string; useCase: string; icon: React.ReactNode }> = {
  sage:     { label: 'Sage', useCase: 'Success, completion, learning', icon: <BookOpen size={16} /> },
  ochre:    { label: 'Ochre', useCase: 'Warning, memory, review', icon: <Star size={16} /> },
  sky:      { label: 'Sky', useCase: 'Info, progress, concepts', icon: <Zap size={16} /> },
  lavender: { label: 'Lavender', useCase: 'Creative, notes, ideas', icon: <Heart size={16} /> },
  brick:    { label: 'Brick', useCase: 'Error, attention, exams', icon: <Flame size={16} /> },
  ink:      { label: 'Ink', useCase: 'Neutral, dark, metadata', icon: <Pencil size={16} /> },
}

const meta: Meta<typeof PaperIconCircle> = {
  title: 'Components/Wrappers/PaperIconCircle',
  component: PaperIconCircle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Paper Icon Circle

A hand-drawn circular container for icons. Renders a rough.js circle SVG with tonal fill, wobbly outline, and centered content slot. Six tonal palettes provide consistent semantic coloring.

### Import
\`\`\`tsx
import { PaperIconCircle } from '@paper-ui/core'
import type { IconTone } from '@paper-ui/core'
\`\`\`

### Tone Palette
| Tone | Use Case |
|------|----------|
| sage | Success, completion, learning |
| ochre | Warning, memory, review |
| sky | Info, progress, concepts |
| lavender | Creative, notes, ideas |
| brick | Error, attention, exams |
| ink | Neutral, dark, metadata |`,
      },
    },
  },
  argTypes: {
    tone: {
      description: 'Color palette. Determines fill, stroke, and highlight.',
      control: 'select',
      options: ['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as IconTone[],
      table: { defaultValue: { summary: 'sage' } },
    },
    size: {
      description: 'Outer diameter in px. The rough.js circle adjusts radius accordingly.',
      control: { type: 'number', min: 24, max: 80, step: 4 },
      table: { defaultValue: { summary: '36' } },
    },
    children: {
      description: 'Icon or content centered inside the circle. Typically a lucide-react icon.',
    },
    className: {
      description: 'Additional CSS classes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof PaperIconCircle>

export const AllTones: Story = {
  parameters: { docs: { description: { story: 'Six tonal variants — each with distinct fill, stroke, and highlight colors. Map tones to semantic meaning in your UI.' } } },
  render: () => (
    <div className="flex gap-6 flex-wrap items-start">
      {(Object.keys(TONE_LABELS) as IconTone[]).map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2 text-center">
          <PaperIconCircle tone={tone} size={48}>
            {TONE_LABELS[tone].icon}
          </PaperIconCircle>
          <div>
            <span className="font-architect text-[11px] text-ink uppercase tracking-widest block">{TONE_LABELS[tone].label}</span>
            <span className="font-caveat text-[10px] text-ink-muted">{TONE_LABELS[tone].useCase}</span>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  parameters: { docs: { description: { story: 'Four sizes from compact (28px) to prominent (60px). Icons should scale proportionally — roughly 40–45% of the circle size.' } } },
  render: () => (
    <div className="flex gap-6 items-center">
      {[28, 36, 48, 60].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <PaperIconCircle tone="sky" size={size}>
            {React.createElement(size <= 36 ? BookOpen : Brain, { size: Math.round(size * 0.44) })}
          </PaperIconCircle>
          <span className="font-architect text-xs text-ink-muted">{size}px</span>
        </div>
      ))}
    </div>
  ),
}

export const Default: Story = {
  args: { tone: 'sage', size: 36 },
  parameters: { docs: { description: { story: 'The simplest usage — a sage-toned circle with a BookOpen icon at the default 36px size.' } } },
  render: (args) => (
    <PaperIconCircle {...args}>
      <BookOpen size={16} />
    </PaperIconCircle>
  ),
}

export const InCard: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

PaperIconCircle pairs with PaperCard and text for structured card headers. Match the tone to the semantic meaning of the content.

### Design Guidelines
- **When to use:** Icon containers in card headers, course/subject category indicators, status indicators, feature highlights
- **When not to use:** As a primary interactive element (use IconButton), for very large icons (>80px, use a doodle), for avatar photos (use Avatar)
- **Best practice:** \`size={36}\` for card headers, \`size={48}\` for feature highlights
- Always pair with visible text — don't rely on icon color alone for meaning

### Related Components
- **IconWrapper** — Square and container-less icon wrapping options
- **Avatar** — Initials-based avatar circles
- **StatusBadge** — Semantic status badges that pair with icon circles`,
      },
    },
  },
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="bg-white rounded-lg p-4 border border-dashed border-[#d4cfc4] flex items-center gap-4">
        <PaperIconCircle tone="sage" size={48}>
          <BookOpen size={20} />
        </PaperIconCircle>
        <div>
          <h3 className="font-architect text-base text-ink">Course Materials</h3>
          <p className="font-kalam text-xs text-ink-muted">12 documents · 4.2h studied</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-dashed border-[#d4cfc4] flex items-center gap-4">
        <PaperIconCircle tone="sky" size={48}>
          <Zap size={20} />
        </PaperIconCircle>
        <div>
          <h3 className="font-architect text-base text-ink">Quick Review</h3>
          <p className="font-kalam text-xs text-ink-muted">Flashcards ready for today</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-dashed border-[#d4cfc4] flex items-center gap-4">
        <PaperIconCircle tone="brick" size={48}>
          <MessageSquare size={20} />
        </PaperIconCircle>
        <div>
          <h3 className="font-architect text-base text-ink">Exam Prep</h3>
          <p className="font-kalam text-xs text-ink-muted">3 practice exams available</p>
        </div>
      </div>
    </div>
  ),
}
