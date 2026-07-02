import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Lightbox } from '@paper-ui/components/media'
import { PaperButton } from '@paper-ui/components/buttons'

const images = [
  { src: 'https://picsum.photos/seed/lb1/800/600', alt: 'Diagram 1', caption: 'Neural network architecture' },
  { src: 'https://picsum.photos/seed/lb2/800/600', alt: 'Diagram 2', caption: 'Backpropagation visualized' },
  { src: 'https://picsum.photos/seed/lb3/800/600', alt: 'Diagram 3', caption: 'Gradient descent surface' },
  { src: 'https://picsum.photos/seed/lb4/800/600', alt: 'Diagram 4', caption: 'Activation functions' },
]

const meta: Meta<typeof Lightbox> = {
  title: 'Components/Media/Lightbox',
  component: Lightbox,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Lightbox>

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          View 4 diagrams
        </PaperButton>
        <Lightbox images={images} initialIndex={0} isOpen={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          View 4 diagrams
        </PaperButton>
        <Lightbox images={images} initialIndex={0} isOpen={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}

export const Variants: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
        <PaperButton size="sm" onClick={() => setOpen(true)}>
          Open at slide 2
        </PaperButton>
        <Lightbox images={images} initialIndex={1} isOpen={open} onClose={() => setOpen(false)} />
      </div>
    )
  },
}
