import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MasonryGrid } from '@paper-ui/components/media'

const meta: Meta<typeof MasonryGrid> = {
  title: 'Components/Media/MasonryGrid',
  component: MasonryGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof MasonryGrid>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <MasonryGrid columns={3} gap={16}>
        {[160, 200, 120, 180, 140, 220].map((h, i) => (
          <div
            key={i}
            className="rounded-lg p-4 border border-[#d4cfc2] font-kalam text-[#3a3733] break-inside-avoid"
            style={{ height: h, background: '#e8e4dc', marginBottom: 16 }}
          >
            <strong>Item {i + 1}</strong>
            <p className="text-xs text-[#9c9484] mt-1">Content</p>
          </div>
        ))}
      </MasonryGrid>
    </div>
  ),
}
