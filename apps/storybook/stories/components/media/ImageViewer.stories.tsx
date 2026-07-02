import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageViewer } from '@paper-ui/components/media'

const meta: Meta<typeof ImageViewer> = {
  title: 'Components/Media/ImageViewer',
  component: ImageViewer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ImageViewer>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <ImageViewer
        src="https://placehold.co/800x500"
        alt="Sample image"
        caption="Scroll to zoom, drag to pan"
      />
    </div>
  ),
}
