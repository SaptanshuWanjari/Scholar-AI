import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inspector } from '@paper-ui/components/overlays'
import { PaperButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof Inspector> = {
  title: 'Components/Overlays/Inspector',
  component: Inspector,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Inspector>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Inspect Deck
        </PaperButton>
        <Inspector
          open={open}
          onClose={() => setOpen(false)}
          title="Deck Inspector"
          fields={[
            { label: 'Title', value: 'Linear Algebra Final Review' },
            { label: 'Course', value: 'MATH 240' },
            { label: 'Cards', value: 128 },
            { label: 'Created', value: 'Mar 15, 2026' },
            { label: 'Accuracy', value: '91% (avg)' },
            { label: 'Status', value: <span style={{ color: '#3f7a4e' }}>Active</span> },
          ]}
        >
          <div className="flex gap-2 mt-3">
            <PaperButton size="sm" tone="paper">Edit deck</PaperButton>
            <PaperButton size="sm" tone="red">Delete deck</PaperButton>
          </div>
        </Inspector>
      </div>
    )
  },
}
