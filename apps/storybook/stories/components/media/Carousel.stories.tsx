import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from '@paper-ui/components/media'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Media/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Carousel>

const slides = [
  <div key="1" className="h-48 bg-[#e8e4dc] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 1</div>,
  <div key="2" className="h-48 bg-[#dfebd6] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 2</div>,
  <div key="3" className="h-48 bg-[#dde4f0] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 3</div>,
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-md">
      <Carousel>{slides}</Carousel>
    </div>
  ),
}

export const AutoPlay: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-md">
      <Carousel autoPlay={2000}>{slides}</Carousel>
    </div>
  ),
}
