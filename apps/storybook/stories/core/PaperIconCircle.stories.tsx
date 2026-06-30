import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperIconCircle } from '@paper-ui/core'
import type { IconTone } from '@paper-ui/core'
import { BookOpen, Star, Zap, Heart, Flame, Pencil } from 'lucide-react'

const TONE_ICONS: Record<IconTone, React.ReactNode> = {
  sage:     <BookOpen size={16} />,
  ochre:    <Star size={16} />,
  sky:      <Zap size={16} />,
  lavender: <Heart size={16} />,
  brick:    <Flame size={16} />,
  ink:      <Pencil size={16} />,
}

const meta: Meta<typeof PaperIconCircle> = {
  title: 'Core/PaperIconCircle',
  component: PaperIconCircle,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PaperIconCircle>

export const AllTones: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap items-center">
      {(Object.keys(TONE_ICONS) as IconTone[]).map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-1">
          <PaperIconCircle tone={tone}>{TONE_ICONS[tone]}</PaperIconCircle>
          <span className="font-architect text-[10px] text-ink-muted uppercase tracking-widest">{tone}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      {[28, 36, 48, 60].map((size) => (
        <PaperIconCircle key={size} tone="sky" size={size}>
          <BookOpen size={Math.round(size * 0.44)} />
        </PaperIconCircle>
      ))}
    </div>
  ),
}

export const Default: Story = {
  args: { tone: 'sage', size: 36 },
  render: (args) => (
    <PaperIconCircle {...args}>
      <BookOpen size={16} />
    </PaperIconCircle>
  ),
}
