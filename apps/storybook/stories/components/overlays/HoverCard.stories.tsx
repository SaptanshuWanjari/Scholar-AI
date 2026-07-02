import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard } from '@paper-ui/components/overlays'

const meta: Meta<typeof HoverCard> = {
  title: 'Components/Overlays/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-20 bg-[#f4f1ea] flex gap-12 justify-center">
        <HoverCard
          open={open}
          onOpenChange={setOpen}
          trigger={<span className="font-kalam text-sky underline cursor-help" style={{ color: '#4a6f91' }}>spaced repetition</span>}
          openDelay={300}
        >
          <div className="min-w-[220px]">
            <p className="font-bold text-[15px]">Spaced Repetition</p>
            <p className="mt-1 text-sm text-[#6b6055]">
              Study technique that reviews material at increasing intervals to
              exploit the spacing effect for long-term memory.
            </p>
          </div>
        </HoverCard>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-20 bg-[#f4f1ea] flex gap-12 justify-center">
      <HoverCard
        trigger={<span className="font-kalam text-sky underline cursor-help" style={{ color: '#4a6f91' }}>spaced repetition</span>}
      >
        <div className="min-w-[220px]">
          <p className="font-bold text-[15px]">Spaced Repetition</p>
          <p className="mt-1 text-sm text-[#6b6055]">
            Study technique that reviews material at increasing intervals to
            exploit the spacing effect for long-term memory.
          </p>
        </div>
      </HoverCard>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-20 bg-[#f4f1ea] flex gap-12 justify-center">
      <HoverCard
        trigger={<span className="font-kalam text-sky underline cursor-help" style={{ color: '#4a6f91' }}>spaced repetition</span>}
        openDelay={300}
      >
        <div className="min-w-[220px]">
          <p className="font-bold text-[15px]">Spaced Repetition</p>
          <p className="mt-1 text-sm text-[#6b6055]">
            Study technique that reviews material at increasing intervals to
            exploit the spacing effect for long-term memory.
          </p>
        </div>
      </HoverCard>

      <HoverCard
        trigger={<span className="font-kalam text-sage underline cursor-help" style={{ color: '#3f7a4e' }}>active recall</span>}
        placement="top"
        openDelay={500}
        maxWidth={240}
      >
        <div>
          <p className="font-bold text-[15px]">Active Recall</p>
          <p className="mt-1 text-sm text-[#6b6055]">
            Retrieving information from memory strengthens neural connections
            more than passive review.
          </p>
        </div>
      </HoverCard>

      <HoverCard
        trigger={<span className="font-kalam text-ochre underline cursor-help" style={{ color: '#b07a2e' }}>Feynman Technique</span>}
        placement="bottom"
      >
        <div className="min-w-[200px]">
          <p className="font-bold text-[15px]">Feynman Technique</p>
          <p className="mt-1 text-sm text-[#6b6055]">
            Explain a concept in simple terms. Where you stumble is where
            you need to study more.
          </p>
        </div>
      </HoverCard>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-20 bg-[#f4f1ea] flex gap-12 justify-center">
      <HoverCard
        trigger={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d4cfc2] rounded-md font-kalam text-sm cursor-help" style={{ color: '#4a6f91' }}>
            spaced repetition
          </span>
        }
        openDelay={200}
      >
        <div className="min-w-[240px]">
          <p className="font-bold text-[15px]">Spaced Repetition</p>
          <p className="mt-1 text-sm text-[#6b6055]">
            Study technique that reviews material at increasing intervals to
            exploit the spacing effect for long-term memory.
          </p>
          <p className="mt-2 text-xs text-[#9c9484]">Learn more →</p>
        </div>
      </HoverCard>
    </div>
  ),
}
