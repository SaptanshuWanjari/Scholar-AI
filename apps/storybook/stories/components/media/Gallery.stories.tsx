import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gallery } from '@paper-ui/components/media'

const meta: Meta<typeof Gallery> = {
  title: 'Components/Media/Gallery',
  component: Gallery,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Gallery>

const images = Array.from({ length: 6 }, (_, i) => ({
  src: 'https://placehold.co/300x200',
  alt: `Image ${i + 1}`,
  caption: `Fig ${i + 1}`,
}))

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Gallery images={images} columns={3} />
    </div>
  ),
}

export const WithSelection: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<number | null>(null)
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <Gallery images={images} columns={3} />
      </div>
    )
  },
}
