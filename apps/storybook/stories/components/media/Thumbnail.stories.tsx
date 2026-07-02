import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Thumbnail } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof Thumbnail> = {
  title: 'Components/Media/Thumbnail',
  component: Thumbnail,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Thumbnail>

export const Playground: Story = {
  render: () => {
    const [sel, setSel] = useState(0)
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Caption>Click a thumbnail to select</Caption>
        <div className="flex gap-3 flex-wrap mt-3">
          {['Notes', 'Diagrams', 'Slides', 'References'].map((label, i) => (
            <Thumbnail
              key={label}
              src={`https://picsum.photos/seed/thumb_${i}/160/160`}
              alt={label}
              size={100}
              selected={sel === i}
              onClick={() => setSel(i)}
              label={label}
            />
          ))}
        </div>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Thumbnail
        src="https://picsum.photos/seed/thumb_0/160/160"
        alt="Notes"
        size={100}
        label="Notes"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Different sizes</Caption>
        <div className="flex gap-3 flex-wrap items-end">
          <Thumbnail src="https://picsum.photos/seed/thumb_0/120/120" alt="Small" size={60} />
          <Thumbnail src="https://picsum.photos/seed/thumb_1/160/160" alt="Medium" size={100} />
          <Thumbnail src="https://picsum.photos/seed/thumb_2/240/240" alt="Large" size={160} />
        </div>
      </section>

      <section className="space-y-2">
        <Caption>With and without labels</Caption>
        <div className="flex gap-3 flex-wrap">
          <Thumbnail src="https://picsum.photos/seed/thumb_0/160/160" alt="With label" size={100} label="Notes" />
          <Thumbnail src="https://picsum.photos/seed/thumb_1/160/160" alt="Without label" size={100} />
        </div>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => {
    const [sel, setSel] = useState(0)
    return (
      <div className="p-10 space-y-4 bg-[#f4f1ea]">
        <Caption>Click to toggle selection</Caption>
        <div className="flex gap-3 flex-wrap">
          {[0, 1, 2].map((i) => (
            <Thumbnail
              key={i}
              src={`https://picsum.photos/seed/thumb_${i}/160/160`}
              alt={`Thumb ${i}`}
              size={100}
              selected={sel === i}
              onClick={() => setSel(i)}
              label={sel === i ? 'Selected' : 'Click me'}
            />
          ))}
        </div>
      </div>
    )
  },
}
