import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Lightbox } from '@paper-ui/components/media'
import { PaperButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof Lightbox> = {
  title: 'Components/Media/Lightbox',
  component: Lightbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Lightbox>

const images = Array.from({ length: 6 }, (_, i) => ({
  src: 'https://placehold.co/800x600',
  alt: `Image ${i + 1}`,
  caption: `Fig ${i + 1}`,
}))

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <div className="flex flex-wrap gap-2 mb-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setOpen(true)}
              className="w-24 h-24 bg-[#e8e4dc] rounded hover:bg-[#dfebd6]"
            />
          ))}
        </div>
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Click image to open
        </PaperButton>
        <Lightbox images={images} isOpen={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}
