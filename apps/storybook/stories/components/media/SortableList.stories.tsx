import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SortableList } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof SortableList> = {
  title: 'Components/Media/SortableList',
  component: SortableList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof SortableList>

const defaultItems = [
  { id: '1', content: 'Introduction to Machine Learning' },
  { id: '2', content: 'Supervised Learning Algorithms' },
  { id: '3', content: 'Unsupervised Learning' },
  { id: '4', content: 'Neural Networks & Deep Learning' },
  { id: '5', content: 'Reinforcement Learning' },
]

export const Playground: Story = {
  render: () => {
    const [items, setItems] = useState(defaultItems)
    return (
      <div className="p-10 bg-[#f4f1ea] max-w-md">
        <Caption>Drag items to reorder</Caption>
        <SortableList items={items} onReorder={setItems} className="mt-3" />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState(defaultItems)
    return (
      <div className="p-10 bg-[#f4f1ea] max-w-md">
        <Caption>Drag items to reorder</Caption>
        <SortableList items={items} onReorder={setItems} className="mt-3" />
      </div>
    )
  },
}

export const States: Story = {
  render: () => {
    const [items, setItems] = useState(defaultItems)
    const [single, setSingle] = useState([defaultItems[0]])
    return (
      <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-md">
        <section className="space-y-2">
          <Caption>Empty list</Caption>
          <SortableList items={[]} onReorder={() => {}} />
        </section>

        <section className="space-y-2">
          <Caption>Single item</Caption>
          <SortableList items={single} onReorder={setSingle} />
        </section>

        <section className="space-y-2">
          <Caption>5 items</Caption>
          <SortableList items={items} onReorder={setItems} />
        </section>
      </div>
    )
  },
}
