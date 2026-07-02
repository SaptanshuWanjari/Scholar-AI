import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof Carousel> = {
  title: 'Components/Media/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Carousel>

const studyTips = [
  <div key="1" className="h-56 bg-[#e8e4dc] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 1: Active recall beats re-reading</div>,
  <div key="2" className="h-56 bg-[#dfebd6] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 2: Space out your repetition</div>,
  <div key="3" className="h-56 bg-[#dde4f0] flex items-center justify-center font-kalam text-xl text-[#3a3733]">Study tip 3: Teach what you learn</div>,
]

const autoSlides = [
  <div key="1" className="h-48 bg-[#f0ebe2] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 1 — Introduction</div>,
  <div key="2" className="h-48 bg-[#ebe0d4] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 2 — Methods</div>,
  <div key="3" className="h-48 bg-[#e2dbe6] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 3 — Results</div>,
  <div key="4" className="h-48 bg-[#dce4d8] flex items-center justify-center font-kalam text-lg text-[#3a3733]">Slide 4 — Discussion</div>,
]

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-lg">
      <Caption>Manual navigation</Caption>
      <Carousel>
        {studyTips}
      </Carousel>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-lg">
      <section className="space-y-2">
        <Caption>Manual navigation</Caption>
        <Carousel>
          {studyTips}
        </Carousel>
      </section>

      <section className="space-y-2">
        <Caption>Auto-play every 3s</Caption>
        <Carousel autoPlay={3000}>
          {autoSlides}
        </Carousel>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-lg">
      <Caption>Single slide</Caption>
      <Carousel>
        <div className="h-48 bg-[#f0ebe2] flex items-center justify-center font-kalam text-lg text-[#3a3733]">
          The only slide — no navigation needed
        </div>
      </Carousel>
    </div>
  ),
}
