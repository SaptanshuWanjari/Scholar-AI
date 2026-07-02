import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Gallery } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof Gallery> = {
  title: 'Components/Media/Gallery',
  component: Gallery,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Gallery>

const sixImages = [
  { src: 'https://picsum.photos/seed/g1/400/300', alt: 'Flashcard deck' },
  { src: 'https://picsum.photos/seed/g2/400/300', alt: 'Textbook page' },
  { src: 'https://picsum.photos/seed/g3/400/300', alt: 'Study notes' },
  { src: 'https://picsum.photos/seed/g4/400/300', alt: 'Whiteboard diagram', caption: 'Whiteboard' },
  { src: 'https://picsum.photos/seed/g5/400/300', alt: 'Reference sheet' },
  { src: 'https://picsum.photos/seed/g6/400/300', alt: 'Summary mind map', caption: 'Mind map' },
]

const fourImages = [
  { src: 'https://picsum.photos/seed/g7/500/375', alt: 'Lecture slide 1', caption: 'Slide 1' },
  { src: 'https://picsum.photos/seed/g8/500/375', alt: 'Lecture slide 2', caption: 'Slide 2' },
  { src: 'https://picsum.photos/seed/g9/500/375', alt: 'Lecture slide 3', caption: 'Slide 3' },
  { src: 'https://picsum.photos/seed/g10/500/375', alt: 'Lecture slide 4', caption: 'Slide 4' },
]

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Gallery images={sixImages} columns={3} />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-10 bg-[#f4f1ea]">
      <section className="space-y-3">
        <Caption>columns=3, gap=md</Caption>
        <Gallery images={sixImages} columns={3} />
      </section>

      <section className="space-y-3">
        <Caption>columns=2, gap=lg</Caption>
        <Gallery images={fourImages} columns={2} gap="lg" />
      </section>

      <section className="space-y-3">
        <Caption>columns=4</Caption>
        <Gallery images={sixImages} columns={4} />
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-10 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Empty gallery</Caption>
        <Gallery images={[]} columns={3} />
      </section>

      <section className="space-y-2">
        <Caption>Single image</Caption>
        <Gallery
          images={[{ src: 'https://picsum.photos/seed/single/400/300', alt: 'Single image', caption: 'Just one' }]}
          columns={3}
        />
      </section>
    </div>
  ),
}
