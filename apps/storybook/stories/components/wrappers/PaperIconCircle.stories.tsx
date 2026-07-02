import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperIconCircle } from '@paper-ui/core'
import type { IconTone } from '@paper-ui/core'
import { BookOpen, Star, Zap, Heart, Flame, Pencil, MessageSquare, Brain } from 'lucide-react'

const meta: Meta<typeof PaperIconCircle> = {
  title: 'Components/Wrappers/PaperIconCircle',
  component: PaperIconCircle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperIconCircle>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperIconCircle tone="sage" size={36}>
        <BookOpen size={16} />
      </PaperIconCircle>
    </div>
  ),
}

export const AllTones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-4 flex-wrap items-end">
      {([
        { tone: 'sage' as IconTone, icon: <BookOpen size={18} />, label: 'sage' },
        { tone: 'ochre' as IconTone, icon: <Star size={18} />, label: 'ochre' },
        { tone: 'sky' as IconTone, icon: <Zap size={18} />, label: 'sky' },
        { tone: 'lavender' as IconTone, icon: <Heart size={18} />, label: 'lavender' },
        { tone: 'brick' as IconTone, icon: <Flame size={18} />, label: 'brick' },
        { tone: 'ink' as IconTone, icon: <Pencil size={18} />, label: 'ink' },
      ]).map(({ tone, icon, label }) => (
        <div key={tone} className="flex flex-col items-center gap-1">
          <PaperIconCircle tone={tone} size={44}>{icon}</PaperIconCircle>
          <span className="font-architect text-[10px] text-ink-muted">{label}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 items-end">
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

export const InContext: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 max-w-sm">
      {[
        { tone: 'sage' as IconTone, icon: <BookOpen size={20} />, title: 'Course Materials', meta: '12 documents · 4.2h studied' },
        { tone: 'sky' as IconTone, icon: <Zap size={20} />, title: 'Quick Review', meta: 'Flashcards ready for today' },
        { tone: 'brick' as IconTone, icon: <MessageSquare size={20} />, title: 'Exam Prep', meta: '3 practice exams available' },
      ].map(({ tone, icon, title, meta }) => (
        <div key={tone} className="flex items-center gap-4 p-4 bg-white/60 rounded-lg border border-dashed border-[#d4cfc4]">
          <PaperIconCircle tone={tone} size={44}>{icon}</PaperIconCircle>
          <div>
            <h3 className="font-architect text-base text-ink">{title}</h3>
            <p className="font-kalam text-xs text-ink-muted">{meta}</p>
          </div>
        </div>
      ))}
    </div>
  ),
}
