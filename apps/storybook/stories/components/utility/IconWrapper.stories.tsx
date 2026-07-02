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
    <div className="p-10 bg-[#f4f1ea]">
      <IconWrapper tone="sage" size={48}>
        <Brain size={22} />
      </IconWrapper>
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <IconWrapper tone="sage" size={48}>
        <Brain size={22} />
      </IconWrapper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8 max-w-3xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Circle shape — all tones</p>
        <div className="flex items-center gap-4">
          {TONES.map((t, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <IconWrapper key={t} tone={t} shape="circle">
                <Icon size={18} />
              </IconWrapper>
            )
          })}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Square shape — sage, ochre, sky</p>
        <div className="flex items-center gap-4">
          {(['sage', 'ochre', 'sky'] as const).map((t, i) => {
            const Icon = ICONS[i]
            return (
              <IconWrapper key={t} tone={t} shape="square">
                <Icon size={18} />
              </IconWrapper>
            )
          })}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">None shape — sage, ochre, sky</p>
        <div className="flex items-center gap-4">
          {(['sage', 'ochre', 'sky'] as const).map((t, i) => {
            const Icon = ICONS[i]
            return (
              <IconWrapper key={t} tone={t} shape="none" size={32}>
                <Icon size={20} />
              </IconWrapper>
            )
          })}
        </div>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8 max-w-3xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Sizes (24, 36, 48, 56, 64)</p>
        <div className="flex items-end gap-4">
          {[24, 36, 48, 56, 64].map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <IconWrapper tone="sage" size={s}>
                <Brain size={Math.round(s * 0.45)} />
              </IconWrapper>
              <span className="font-architect text-[10px] text-ink-muted/50">{s}px</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8 max-w-3xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Icon grid — all tones</p>
        <div className="grid grid-cols-6 gap-4">
          {TONES.map((t) => (
            <div key={t} className="flex flex-col items-center gap-2">
              <IconWrapper tone={t} size={48}>
                <Brain size={22} />
              </IconWrapper>
              <span className="font-architect text-[10px] text-ink-muted/50">{t}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Mixed shapes in row</p>
        <div className="flex items-center gap-4">
          <IconWrapper tone="sage" shape="circle">
            <Brain size={18} />
          </IconWrapper>
          <IconWrapper tone="ochre" shape="square">
            <BookOpen size={18} />
          </IconWrapper>
          <IconWrapper tone="sky" shape="none" size={32}>
            <Star size={20} />
          </IconWrapper>
          <IconWrapper tone="lavender" shape="circle">
            <Zap size={18} />
          </IconWrapper>
          <IconWrapper tone="brick" shape="square">
            <Search size={18} />
          </IconWrapper>
        </div>
      </section>
    </div>
  ),
}
