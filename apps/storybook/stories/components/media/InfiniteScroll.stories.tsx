import React, { useState, useCallback } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InfiniteScroll } from '@paper-ui/components/media'

const meta: Meta<typeof InfiniteScroll> = {
  title: 'Components/Media/InfiniteScroll',
  component: InfiniteScroll,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof InfiniteScroll>

export const Default: Story = {
  render: () => {
    const [count, setCount] = useState(20)
    const loadMore = useCallback(() => {
      setTimeout(() => setCount((c) => Math.min(c + 10, 50)), 500)
    }, [])

    return (
      <div className="p-8 bg-[#f4f1ea]">
        <div className="border border-[#d4cfc2] rounded-lg bg-white" style={{ height: 300, overflowY: 'auto' }}>
          <InfiniteScroll onLoadMore={loadMore} hasMore={count < 50}>
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="px-4 py-3 font-kalam text-sm text-[#3a3733] border-b border-[#f0efed]">
                Item {i + 1}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </div>
    )
  },
}
