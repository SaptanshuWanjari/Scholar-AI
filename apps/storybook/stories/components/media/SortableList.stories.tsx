import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SortableList } from '@paper-ui/components/media'

const meta: Meta<typeof SortableList> = {
  title: 'Components/Media/SortableList',
  component: SortableList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SortableList>

const items = [
  { id: '1', content: 'First item' },
  { id: '2', content: 'Second item' },
  { id: '3', content: 'Third item' },
  { id: '4', content: 'Fourth item' },
]

export const Default: Story = {
  render: () => {
    const [state, setState] = useState(items)
    return (
      <div className="p-8 bg-[#f4f1ea] max-w-sm">
        <SortableList items={state} onReorder={setState} />
      </div>
    )
  },
}
