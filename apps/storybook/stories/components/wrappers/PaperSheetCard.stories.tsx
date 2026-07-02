import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetCard } from '@paper-ui/core'
import { MarkerHighlight, Tape } from '@paper-ui/components'

const meta: Meta<typeof PaperSheetCard> = {
  title: 'Components/Wrappers/PaperSheetCard',
  component: PaperSheetCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperSheetCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div style={{ width: 320 }}>
        <PaperSheetCard title="CHAPTER 1">
          <p className="font-kalam text-sm text-ink leading-relaxed">
            The paper-sheet SVG scales to fill this container. Its hand-drawn outline and
            bottom-right fold adapt to the measured width and height.
          </p>
        </PaperSheetCard>
      </div>
    </div>
  ),
}

export const NoTitle: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div style={{ width: 280 }}>
        <PaperSheetCard>
          <p className="font-kalam text-sm text-ink leading-relaxed">
            Without a title prop the content fills the full padding area.
          </p>
        </PaperSheetCard>
      </div>
    </div>
  ),
}

export const WithDecorations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="relative" style={{ width: 300 }}>
        <div className="absolute -top-1 left-3 z-20">
          <Tape corner="top-left" width={30} rotate={-18} />
        </div>
        <PaperSheetCard title="PINNED NOTE">
          <p className="font-kalam text-sm text-ink">
            A note held in place with tape. <MarkerHighlight color="#f6e27a">Key insight highlighted.</MarkerHighlight>
          </p>
        </PaperSheetCard>
      </div>
    </div>
  ),
}

export const MultipleSheets: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="space-y-1">
        {[300, 290, 310, 295].map((w, i) => (
          <div key={i} style={{ width: w }}>
            <PaperSheetCard title={i === 0 ? 'Page 1' : undefined}>
              {i === 0 && (
                <p className="font-kalam text-sm text-ink leading-relaxed">
                  Top sheet with title. Sheets beneath it create a notebook stack effect.
                </p>
              )}
            </PaperSheetCard>
          </div>
        ))}
      </div>
    </div>
  ),
}
