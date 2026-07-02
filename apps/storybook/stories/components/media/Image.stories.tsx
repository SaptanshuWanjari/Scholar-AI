import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from '@paper-ui/components/media'

const meta: Meta<typeof Image> = {
  title: 'Components/Media/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Image>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Image
        src="https://placehold.co/300x200"
        alt="Sample image"
        caption="Fig 1. Study materials"
        width={300}
        aspectRatio="4/3"
      />
    </div>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Image
        src="https://invalid-url-that-will-fail.com/image.jpg"
        alt="Failed image"
        width={300}
        aspectRatio="4/3"
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 space-y-6 bg-[#f4f1ea]">
      <Image
        src="https://placehold.co/200x150"
        alt="Small image"
        width={200}
        aspectRatio="4/3"
        rounded="md"
      />
      <Image
        src="https://placehold.co/300x225"
        alt="Medium image"
        width={300}
        aspectRatio="4/3"
        rounded="md"
      />
      <Image
        src="https://placehold.co/400x300"
        alt="Large image"
        width={400}
        aspectRatio="4/3"
        rounded="md"
      />
    </div>
  ),
}
