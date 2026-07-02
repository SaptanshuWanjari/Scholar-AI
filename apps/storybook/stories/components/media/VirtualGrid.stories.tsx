import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualGrid } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof VirtualGrid> = {
  title: 'Components/Media/VirtualGrid',
  component: VirtualGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VirtualGrid>

const fiveHundredItems = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  color: `hsl(${(i * 37) % 360}, 60%, 75%)`,
}))

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>500 items, 120x120 cells, 400px container</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualGrid
          items={fiveHundredItems}
          itemWidth={120}
          itemHeight={120}
          height={400}
          gap={8}
          renderItem={(item: { id: number; color: string }) => (
            <div
              className="rounded-md flex items-center justify-center font-architect text-xs text-[#3a3733] border border-[#d4cfc2] h-full"
              style={{ background: item.color }}
            >
              Card {item.id}
            </div>
          )}
        />
      </div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Small cells (80x80), gap=4</Caption>
        <div className="border border-[#d4cfc2] rounded-lg">
          <VirtualGrid
            items={fiveHundredItems}
            itemWidth={80}
            itemHeight={80}
            height={400}
            gap={4}
            renderItem={(item: { id: number; color: string }) => (
              <div
                className="rounded-md flex items-center justify-center font-architect text-[10px] text-[#3a3733] border border-[#d4cfc2] h-full"
                style={{ background: item.color }}
              >
                {item.id}
              </div>
            )}
          />
        </div>
      </section>

      <section className="space-y-2">
        <Caption>Large cells (160x160), gap=12</Caption>
        <div className="border border-[#d4cfc2] rounded-lg">
          <VirtualGrid
            items={fiveHundredItems}
            itemWidth={160}
            itemHeight={160}
            height={400}
            gap={12}
            renderItem={(item: { id: number; color: string }) => (
              <div
                className="rounded-md flex items-center justify-center font-architect text-sm text-[#3a3733] border border-[#d4cfc2] h-full"
                style={{ background: item.color }}
              >
                Card {item.id}
              </div>
            )}
          />
        </div>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Empty grid</Caption>
      <div className="mt-3 border border-[#d4cfc2] rounded-lg">
        <VirtualGrid
          items={[]}
          itemWidth={120}
          itemHeight={120}
          height={400}
          gap={8}
          renderItem={() => null}
        />
      </div>
    </div>
  ),
}
