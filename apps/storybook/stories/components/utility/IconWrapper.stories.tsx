import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconWrapper } from '@paper-ui/components/utility'
import { Brain, BookOpen, Star, Zap, Search } from 'lucide-react'

const meta: Meta<typeof IconWrapper> = {
  title: 'Components/Utility/IconWrapper',
  component: IconWrapper,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof IconWrapper>

const TONES = ['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as const
const ICONS = [Brain, BookOpen, Star, Zap, Search]

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <IconWrapper tone="sage" size={48}>
        <Brain size={22} />
      </IconWrapper>
    </div>
  ),
}

export const Shapes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="space-y-1">
        <p className="font-architect text-xs text-ink-muted/60">Circle</p>
        <div className="flex gap-3">
          {TONES.slice(0, 3).map((t, i) => (
            <IconWrapper key={t} tone={t} shape="circle">
              {React.createElement(ICONS[i], { size: 18 })}
            </IconWrapper>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-architect text-xs text-ink-muted/60">Square</p>
        <div className="flex gap-3">
          {TONES.slice(0, 3).map((t, i) => (
            <IconWrapper key={t} tone={t} shape="square">
              {React.createElement(ICONS[i], { size: 18 })}
            </IconWrapper>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <p className="font-architect text-xs text-ink-muted/60">None</p>
        <div className="flex gap-3">
          {TONES.slice(0, 3).map((t, i) => (
            <IconWrapper key={t} tone={t} shape="none">
              {React.createElement(ICONS[i], { size: 20 })}
            </IconWrapper>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-end gap-3">
      {[24, 36, 48, 56, 64].map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <IconWrapper tone="sage" size={s}>
            <Brain size={Math.round(s * 0.45)} />
          </IconWrapper>
          <span className="font-architect text-[10px] text-ink-muted/50">{s}px</span>
        </div>
      ))}
    </div>
  ),
}

export const AllTones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] grid grid-cols-6 gap-3">
      {TONES.map((t) => (
        <div key={t} className="flex flex-col items-center gap-1">
          <IconWrapper tone={t} size={44}>
            <Brain size={20} />
          </IconWrapper>
          <span className="font-architect text-[10px] text-ink-muted/50">{t}</span>
        </div>
      ))}
    </div>
  ),
}
