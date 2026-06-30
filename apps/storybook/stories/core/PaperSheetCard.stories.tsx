import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetCard } from '@paper-ui/core'

const meta: Meta<typeof PaperSheetCard> = {
  title: 'Core/PaperSheetCard',
  component: PaperSheetCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PaperSheetCard>

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <PaperSheetCard title="CHAPTER 1">
        <p className="font-kalam text-sm text-ink leading-relaxed">
          The paper-sheet SVG scales to fill this container. Its hand-drawn outline and
          bottom-right fold are computed from the measured width and height.
        </p>
      </PaperSheetCard>
    </div>
  ),
}

export const NoTitle: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <PaperSheetCard>
        <p className="font-kalam text-sm text-ink leading-relaxed">
          Without a title prop the content fills the full padding area.
        </p>
      </PaperSheetCard>
    </div>
  ),
}

export const Narrow: Story = {
  render: () => (
    <div style={{ width: 180 }}>
      <PaperSheetCard title="NOTES">
        <p className="font-kalam text-xs text-ink leading-relaxed">
          Same component at a narrower container. The SVG fold adapts automatically.
        </p>
      </PaperSheetCard>
    </div>
  ),
}
