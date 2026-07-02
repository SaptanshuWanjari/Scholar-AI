import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualList } from '@paper-ui/components/media'

const meta: Meta<typeof VirtualList> = {
  title: 'Components/Media/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VirtualList>

const items = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  label: `Item ${i + 1}`,
}))

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="border border-[#d4cfc2] rounded-lg overflow-hidden">
        <VirtualList
          items={items}
          itemHeight={36}
          height={400}
          renderItem={(item: { id: number; label: string }) => (
            <div className="flex items-center h-full px-4 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed] bg-[#faf8f5] hover:bg-[#f0efed]">
              {item.label}
            </div>
          )}
        />
      </div>
    </div>
  ),
}

export const WithCustomRow: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="border border-[#d4cfc2] rounded-lg overflow-hidden">
        <VirtualList
          items={items}
          itemHeight={40}
          height={400}
          renderItem={(item: { id: number; label: string }) => (
            <div className="flex items-center gap-3 h-full px-4 bg-[#faf8f5] hover:bg-[#f0efed] border-b border-[#f0efed]">
              <span className="w-6 h-6 rounded-full bg-[#dfebd6] flex items-center justify-center text-xs font-architect text-[#3a3733]">
                {(item.id + 1) % 100}
              </span>
              <span className="font-kalam text-sm text-[#3a3733]">{item.label}</span>
            </div>
          )}
        />
      </div>
    </div>
  ),
}
