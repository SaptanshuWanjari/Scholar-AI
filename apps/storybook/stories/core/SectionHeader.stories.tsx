import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeader, SectionLabel } from '@paper-ui/core'

const meta: Meta<typeof SectionHeader> = {
  title: 'Core/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <SectionHeader title="Recent Notes" />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="w-80">
      <SectionHeader
        title="Recent Notes"
        action={
          <button className="font-architect text-xs text-ink-muted uppercase tracking-widest hover:text-ink">
            View all →
          </button>
        }
      />
    </div>
  ),
}

export const WithMarker: Story = {
  render: () => (
    <div className="w-80">
      <SectionHeader
        title="Highlighted Section"
        marker
        markerColor="#f6e27a"
        action={<span className="font-architect text-xs text-ink-muted">3 items</span>}
      />
    </div>
  ),
}

export const LabelStandalone: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <SectionLabel>Chapter label</SectionLabel>
      <SectionLabel className="text-ink">Darker label</SectionLabel>
    </div>
  ),
}
