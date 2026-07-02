import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCard, PaperPanel, MarkerHighlight } from '@paper-ui/core'
import { PushPinDoodle, StarDoodle } from '../../../../paper-ui/src/components/doodles'
import { Tape } from '../../../../paper-ui/src/components/decorations'

const meta: Meta<typeof PaperCard> = {
  title: 'Components/Wrappers/PaperCard',
  component: PaperCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperCard shadow="md" className="p-5 w-56">
        <p className="font-kalam text-sm text-ink">A warm paper surface with a hand-drawn border.</p>
      </PaperCard>
    </div>
  ),
}

export const ShadowVariants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap items-start">
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
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperCard shadow="md" lift className="p-4 w-48">
        <p className="font-kalam text-sm text-ink">Hover to see lift effect.</p>
      </PaperCard>
    </div>
  ),
}

export const Panel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperPanel className="p-4 w-48">
        <p className="font-kalam text-sm text-ink">Stroke-only inner panel.</p>
      </PaperPanel>
    </div>
  ),
}

export const WithDecorations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <PaperCard shadow="md" rotate={-1} className="relative w-64">
        <div className="absolute -top-2 left-3 z-20">
          <Tape corner="top-left" width={34} rotate={-24} />
        </div>
        <div className="p-5">
          <h3 className="font-architect text-base text-ink mb-2">Taped Note</h3>
          <p className="font-kalam text-sm text-ink-muted">Masking-tape strips holding this card in place.</p>
        </div>
      </PaperCard>

      <PaperCard shadow="lg" className="p-5 relative w-64">
        <div className="absolute -top-5 -right-3 z-20 rotate-12">
          <PushPinDoodle size={32} color="#c9954f" />
        </div>
        <div className="flex items-start gap-3">
          <StarDoodle size={20} color="#c9954f" className="mt-1 shrink-0" />
          <div>
            <h3 className="font-architect text-base text-ink mb-1">Pinned Card</h3>
            <p className="font-kalam text-sm text-ink">
              A <MarkerHighlight color="#f6e27a">push-pin</MarkerHighlight> and star accent.
            </p>
          </div>
        </div>
      </PaperCard>
    </div>
  ),
}
