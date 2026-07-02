import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet } from '@paper-ui/components/overlays'
import { PaperButton } from '@paper-ui/components/buttons'
import { Blockquote } from '@paper-ui/components/typography'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [side, setSide] = useState<'right' | 'bottom'>('right')

    return (
      <div className="p-10 bg-[#f4f1ea] space-y-4">
        <div className="flex gap-3">
          <PaperButton size="sm" onClick={() => { setSide('right'); setOpen(true) }}>
            Open Right Sheet
          </PaperButton>
          <PaperButton size="sm" onClick={() => { setSide('bottom'); setOpen(true) }}>
            Open Bottom Sheet
          </PaperButton>
        </div>
        <Sheet open={open} onClose={() => setOpen(false)} side={side} title="Study Session Details">
          <div className="space-y-4">
            <p className="font-kalam text-sm text-[#3a3733]">
              This sheet contains auxiliary information about your current study session.
            </p>
            <Blockquote tone="sage" attribution="Cal Newport">
              If you don't produce, you won't thrive — no matter how skilled or talented you are.
            </Blockquote>
            <div className="space-y-2">
              <p className="font-architect text-xs uppercase text-[#9c9484]">Session Stats</p>
              <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
                <span>Cards reviewed</span><span>42</span>
              </div>
              <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
                <span>Accuracy</span><span>87%</span>
              </div>
              <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
                <span>Time spent</span><span>24 min</span>
              </div>
            </div>
          </div>
        </Sheet>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Sheet open={true} onClose={() => {}} side="right" title="Quick Info">
        <div className="space-y-4">
          <p className="font-kalam text-sm text-[#3a3733]">
            A simple right-side sheet with basic content.
          </p>
        </div>
      </Sheet>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] flex gap-8">
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">Right side</p>
        <Sheet open={true} onClose={() => {}} side="right" title="Right Sheet">
          <p className="font-kalam text-sm text-[#3a3733]">Content slides in from the right edge.</p>
        </Sheet>
      </div>
      <div>
        <p className="font-architect text-xs uppercase text-[#9c9484] mb-2">Bottom side</p>
        <Sheet open={true} onClose={() => {}} side="bottom" title="Bottom Sheet">
          <p className="font-kalam text-sm text-[#3a3733]">Content slides up from the bottom edge.</p>
        </Sheet>
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Sheet open={true} onClose={() => {}} side="right" title="Study Session Details">
        <div className="space-y-4">
          <p className="font-kalam text-sm text-[#3a3733]">
            This sheet contains auxiliary information about your current study session.
          </p>
          <Blockquote tone="sage" attribution="Cal Newport">
            If you don't produce, you won't thrive — no matter how skilled or talented you are.
          </Blockquote>
          <div className="space-y-2">
            <p className="font-architect text-xs uppercase text-[#9c9484]">Session Stats</p>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Cards reviewed</span><span>42</span>
            </div>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Accuracy</span><span>87%</span>
            </div>
            <div className="flex justify-between font-kalam text-sm text-[#3a3733]">
              <span>Time spent</span><span>24 min</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <PaperButton size="sm" tone="paper">Dismiss</PaperButton>
          </div>
        </div>
      </Sheet>
    </div>
  ),
}
