import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualList } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof VirtualList> = {
  title: 'Components/Media/VirtualList',
  component: VirtualList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VirtualList>

const thousandItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  label: `Row ${i + 1}`,
}))

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>1000 items, 36px height, 400px container</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualList
          items={thousandItems}
          itemHeight={36}
          height={400}
          renderItem={(item: { id: number; label: string }) => (
            <div className="flex items-center h-full px-4 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
              {item.label}
            </div>
          )}
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Empty list</Caption>
        <div className="border border-[#d4cfc2] rounded-lg">
          <VirtualList
            items={[]}
            itemHeight={36}
            height={200}
            renderItem={() => null}
          />
        </div>
      </section>

      <section className="space-y-2">
        <Caption>Loading state</Caption>
        <div className="border border-[#d4cfc2] rounded-lg">
          <VirtualList
            items={[]}
            itemHeight={36}
            height={200}
            renderItem={() => null}
          />
        </div>
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Custom renderItem with icons</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualList
          items={Array.from({ length: 50 }, (_, i) => ({ id: i, label: `Topic ${i + 1}` }))}
          itemHeight={40}
          height={400}
          renderItem={(item: { id: number; label: string }) => (
            <div className="flex items-center gap-3 h-full px-4 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
              <span className="w-6 h-6 rounded-full bg-[#e8e4dc] flex items-center justify-center text-xs font-architect">
                {item.id + 1}
              </span>
              {item.label}
            </div>
          )}
        />
      </div>
    </div>
  ),
}
