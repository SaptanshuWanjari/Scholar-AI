import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TransferList } from '@paper-ui/components/media'

const meta: Meta<typeof TransferList> = {
  title: 'Components/Media/TransferList',
  component: TransferList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof TransferList>

const items = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
  { id: '4', label: 'Option 4' },
]

export const Default: Story = {
  render: () => {
    const [left, setLeft] = useState(items)
    const [right, setRight] = useState<typeof items>([])

    return (
      <div className="p-8 bg-[#f4f1ea] max-w-2xl">
        <TransferList
          left={left}
          right={right}
          onChange={(l, r) => {
            setLeft(l)
            setRight(r)
          }}
        />
      </div>
    )
  },
}
