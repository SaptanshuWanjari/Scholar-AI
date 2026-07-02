import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualGrid } from '@paper-ui/components/media'

const meta: Meta<typeof VirtualGrid> = {
  title: 'Components/Media/VirtualGrid',
  component: VirtualGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VirtualGrid>

const items = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  color: `hsl(${(i * 7.2) % 360}, 60%, 75%)`,
}))

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="border border-[#d4cfc2] rounded-lg overflow-hidden">
        <VirtualGrid
          items={items}
          itemWidth={120}
          itemHeight={120}
          height={400}
          gap={8}
          renderItem={(item: { id: number; color: string }) => (
            <div
              className="rounded-md flex items-center justify-center font-architect text-xs text-[#3a3733] border border-[#d4cfc2]"
              style={{ background: item.color, height: 120 }}
            >
              {item.id}
            </div>
          )}
        />
      </div>
    </div>
  ),
}
