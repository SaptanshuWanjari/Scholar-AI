import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DescriptionList, DescriptionListItem } from '@paper-ui/components/dataDisplay'

const meta: Meta<typeof DescriptionList> = {
  title: 'Components/Composed/DescriptionList',
  component: DescriptionList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof DescriptionList>

const items = [
  { label: 'Full name', value: 'Jane Doe' },
  { label: 'Email', value: 'jane@example.com' },
  { label: 'Role', value: 'Lead Designer' },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-full max-w-[500px]">
      <DescriptionList variant="minimal">
        {items.map((item, idx) => (
          <DescriptionListItem key={idx} label={item.label} value={item.value} />
        ))}
      </DescriptionList>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="max-w-[500px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Minimal</h3>
        <DescriptionList variant="minimal">
          {items.map((item, idx) => (
            <DescriptionListItem key={idx} label={item.label} value={item.value} />
          ))}
        </DescriptionList>
      </div>
      <div className="max-w-[500px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Notebook</h3>
        <DescriptionList variant="notebook">
          {items.map((item, idx) => (
            <DescriptionListItem key={idx} label={item.label} value={item.value} />
          ))}
        </DescriptionList>
      </div>
    </div>
  ),
}
