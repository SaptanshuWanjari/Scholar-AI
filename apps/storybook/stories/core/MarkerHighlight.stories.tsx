import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarkerHighlight } from '@paper-ui/core'

const meta: Meta<typeof MarkerHighlight> = {
  title: 'Core/MarkerHighlight',
  component: MarkerHighlight,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof MarkerHighlight>

export const Default: Story = {
  render: () => (
    <p className="font-kalam text-xl text-ink">
      The <MarkerHighlight>most important</MarkerHighlight> word on the page.
    </p>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { color: '#f6e27a', label: 'Yellow (default)' },
        { color: '#b5f0b5', label: 'Green' },
        { color: '#f4c0c0', label: 'Pink' },
        { color: '#b0d4f4', label: 'Blue' },
      ].map(({ color, label }) => (
        <p key={color} className="font-kalam text-lg text-ink">
          <MarkerHighlight color={color}>{label}</MarkerHighlight>
        </p>
      ))}
    </div>
  ),
}

export const Thick: Story = {
  render: () => (
    <p className="font-kalam text-xl text-ink">
      <MarkerHighlight thickness={14} color="#f6e27a">Extra thick sweep</MarkerHighlight>
    </p>
  ),
}

export const Animated: Story = {
  render: () => (
    <p className="font-kalam text-xl text-ink">
      <MarkerHighlight animate>Sweeps in on mount</MarkerHighlight>
    </p>
  ),
}
