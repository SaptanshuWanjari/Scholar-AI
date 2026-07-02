import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Thumbnail } from '@paper-ui/components/media'

const meta: Meta<typeof Thumbnail> = {
  title: 'Components/Media/Thumbnail',
  component: Thumbnail,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Thumbnail>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Thumbnail
        src="https://placehold.co/100x100"
        alt="Sample thumbnail"
        size={100}
        label="Image"
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 flex gap-6 items-end bg-[#f4f1ea]">
      <Thumbnail
        src="https://placehold.co/60x60"
        alt="Small"
        size={60}
      />
      <Thumbnail
        src="https://placehold.co/100x100"
        alt="Medium"
        size={100}
      />
      <Thumbnail
        src="https://placehold.co/140x140"
        alt="Large"
        size={140}
      />
    </div>
  ),
}

export const WithBadge: Story = {
  render: () => {
    const [selected, setSelected] = useState(0)
    return (
      <div className="p-8 flex gap-4 bg-[#f4f1ea]">
        {['Image 1', 'Image 2', 'Image 3'].map((label, i) => (
          <Thumbnail
            key={i}
            src="https://placehold.co/100x100"
            alt={label}
            size={100}
            label={label}
            selected={selected === i}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
    )
  },
}
