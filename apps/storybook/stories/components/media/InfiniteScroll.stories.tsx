import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfiniteScroll } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Components/Media/InfiniteScroll',
  component: InfiniteScroll,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof InfiniteScroll>

export const Playground: Story = {
  render: () => {
    const [count, setCount] = useState(20)
    const loadMore = useCallback(() => {
      setTimeout(() => setCount((c) => Math.min(c + 10, 60)), 500)
    }, [])

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Caption>Scroll down to load more (max 60 items).</Caption>
        <div className="mt-3 border border-[#d4cfc2] rounded-lg" style={{ height: 300, overflowY: 'auto' }}>
          <InfiniteScroll onLoadMore={loadMore} hasMore={count < 60}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="px-4 py-2 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
                Item {i + 1}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    )
  },
}

export const Default: Story = {
  render: () => {
    const [count, setCount] = useState(20)
    const loadMore = useCallback(() => {
      setTimeout(() => setCount((c) => Math.min(c + 10, 60)), 500)
    }, [])

    return (
      <div className="p-10 bg-[#f4f1ea]">
        <Caption>Scroll down to load more (max 60 items).</Caption>
        <div className="mt-3 border border-[#d4cfc2] rounded-lg" style={{ height: 300, overflowY: 'auto' }}>
          <InfiniteScroll onLoadMore={loadMore} hasMore={count < 60}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="px-4 py-2 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
                Item {i + 1}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>No more items (all loaded)</Caption>
        <div className="border border-[#d4cfc2] rounded-lg" style={{ height: 300, overflowY: 'auto' }}>
          <InfiniteScroll onLoadMore={() => {}} hasMore={false}>
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="px-4 py-2 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
                Item {i + 1}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </section>
    </div>
  ),
}
