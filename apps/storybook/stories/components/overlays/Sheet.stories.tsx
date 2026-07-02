import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet } from '@paper-ui/components/overlays'
import { PaperButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof Sheet> = {
  title: 'Components/Overlays/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Sheet>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Open Sheet
        </PaperButton>
        <Sheet open={open} onClose={() => setOpen(false)} side="right" title="Study Session Details">
          <div className="space-y-4">
            <p className="font-kalam text-sm text-[#3a3733]">
              This sheet contains auxiliary information about your current study session.
            </p>
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

export const Positions: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="flex gap-3">
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
    </div>
  ),
}
