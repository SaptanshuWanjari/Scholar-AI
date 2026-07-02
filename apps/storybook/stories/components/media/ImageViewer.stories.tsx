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
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <ImageViewer
        src="https://picsum.photos/seed/mindmap/800/500"
        alt="Mind map of biochemistry pathways"
        caption="Use scroll wheel or buttons to zoom. Drag to pan when zoomed."
      />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border border-[#d4cfc2] p-6">
        <h3 className="font-kalam text-lg text-[#3a3733] mb-4">Biochemistry Mind Map</h3>
        <ImageViewer
          src="https://picsum.photos/seed/mindmap/800/500"
          alt="Mind map of biochemistry pathways"
          caption="Use scroll wheel or buttons to zoom. Drag to pan when zoomed."
        />
      </div>
    </div>
  ),
}
