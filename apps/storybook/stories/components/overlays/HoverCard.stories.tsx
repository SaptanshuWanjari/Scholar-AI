import React from 'react'
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

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-12 justify-center">
      <HoverCard
        trigger={<span className="font-kalam underline cursor-help" style={{ color: '#4a6f91' }}>spaced repetition</span>}
      >
        <div className="min-w-[220px]">
          <p className="font-bold text-[14px]">Spaced Repetition</p>
          <p className="mt-1 text-xs text-[#6b6055]">
            Study technique that reviews material at increasing intervals to exploit the spacing effect for long-term memory.
          </p>
        </div>
      </HoverCard>
    </div>
  ),
}

export const WithProfile: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-12 justify-center">
      <HoverCard
        trigger={
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#d4cfc2] rounded-md font-kalam text-sm cursor-help" style={{ color: '#4a6f91' }}>
            Feynman Technique
          </span>
        }
        placement="top"
      >
        <div className="min-w-[240px]">
          <p className="font-bold text-[14px]">Feynman Technique</p>
          <p className="mt-1 text-xs text-[#6b6055]">
            Explain a concept in simple terms. Where you stumble is where you need to study more.
          </p>
          <p className="mt-2 text-xs text-[#9c9484]">Learn more →</p>
        </div>
      </HoverCard>
    </div>
  ),
}
