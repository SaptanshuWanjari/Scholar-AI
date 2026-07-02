import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { TransferList } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const allTopics = [
  { id: '1', label: 'Linear Algebra' },
  { id: '2', label: 'Calculus' },
  { id: '3', label: 'Probability Theory' },
  { id: '4', label: 'Statistics' },
  { id: '5', label: 'Optimization' },
  { id: '6', label: 'Graph Theory' },
]

const meta: Meta<typeof TransferList> = {
  title: 'Components/Media/TransferList',
  component: TransferList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof TransferList>

export const Playground: Story = {
  render: () => {
    const [left, setLeft] = useState(allTopics)
    const [right, setRight] = useState<typeof allTopics>([])

    return (
      <div className="p-10 bg-[#f4f1ea] max-w-3xl">
        <Caption>Move items between lists</Caption>
        <TransferList
          left={left}
          right={right}
          onChange={(l, r) => { setLeft(l); setRight(r) }}
          className="mt-3"
        />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const [left, setLeft] = useState(allTopics)
    const [right, setRight] = useState<typeof allTopics>([])

    return (
      <div className="p-10 bg-[#f4f1ea] max-w-3xl">
        <Caption>Move items between lists</Caption>
        <TransferList
          left={left}
          right={right}
          onChange={(l, r) => { setLeft(l); setRight(r) }}
          className="mt-3"
        />
      </div>
    )
  },
}
