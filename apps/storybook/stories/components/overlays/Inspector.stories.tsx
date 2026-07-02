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

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const fields = [
      { label: 'Title', value: 'Linear Algebra Final Review' },
      { label: 'Course', value: 'MATH 240' },
      { label: 'Cards', value: 128 },
      { label: 'Created', value: 'Mar 15, 2026' },
      { label: 'Last studied', value: 'Jun 28, 2026' },
      { label: 'Accuracy', value: '91% (avg)' },
      { label: 'Status', value: <span style={{ color: '#3f7a4e' }}>Active</span> },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Inspect Deck
        </PaperButton>
        <Inspector open={open} onClose={() => setOpen(false)} title="Deck Inspector" fields={fields}>
          <div className="flex gap-2 mt-3">
            <PaperButton size="sm" tone="paper">
              Edit deck
            </PaperButton>
            <PaperButton size="sm" tone="red">
              Delete deck
            </PaperButton>
          </div>
        </Inspector>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const fields = [
      { label: 'Title', value: 'Linear Algebra Final Review' },
      { label: 'Course', value: 'MATH 240' },
      { label: 'Cards', value: 128 },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Inspector open={true} onClose={() => {}} title="Deck Inspector" fields={fields} />
      </div>
    )
  },
}

export const Variants: Story = {
  render: () => {
    const fields = [
      { label: 'Title (text)', value: 'Linear Algebra Final Review' },
      { label: 'Cards (number)', value: 128 },
      { label: 'Created (date)', value: 'Mar 15, 2026' },
      { label: 'Accuracy (number)', value: '91% (avg)' },
      { label: 'Status (custom)', value: <span style={{ color: '#3f7a4e' }}>Active</span> },
      { label: 'Tags (custom)', value: <span className="px-2 py-0.5 bg-[#e8e4d8] rounded text-xs font-architect">math</span> },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Inspector open={true} onClose={() => {}} title="Field Types" fields={fields} />
      </div>
    )
  },
}

export const Composition: Story = {
  render: () => {
    const fields = [
      { label: 'Title', value: 'Linear Algebra Final Review' },
      { label: 'Course', value: 'MATH 240' },
      { label: 'Cards', value: 128 },
      { label: 'Created', value: 'Mar 15, 2026' },
      { label: 'Last studied', value: 'Jun 28, 2026' },
      { label: 'Accuracy', value: '91% (avg)' },
      { label: 'Status', value: <span style={{ color: '#3f7a4e' }}>Active</span> },
    ]

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Inspector open={true} onClose={() => {}} title="Deck Inspector" fields={fields}>
          <div className="flex gap-2 mt-3">
            <PaperButton size="sm" tone="paper">
              Edit deck
            </PaperButton>
            <PaperButton size="sm" tone="red">
              Delete deck
            </PaperButton>
          </div>
        </Inspector>
      </div>
    )
  },
}
