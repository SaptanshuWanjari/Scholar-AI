import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarkerHighlight } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof MarkerHighlight> = {
  title: 'Components/Decorations/MarkerHighlight',
  component: MarkerHighlight,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof MarkerHighlight>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-64 p-4">
        <p className="font-mono text-sm">
          <MarkerHighlight>Default yellow highlight</MarkerHighlight>
        </p>
      </Paper>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-72 p-6 space-y-3">
        <p className="font-mono text-sm">
          <MarkerHighlight color="#fde047">Yellow</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#f9a8d4">Pink</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#a7f3d0">Green</MarkerHighlight>
        </p>
        <p className="font-mono text-sm">
          <MarkerHighlight color="#bfdbfe">Blue</MarkerHighlight>
        </p>
      </Paper>
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-72 p-6">
        <p className="font-mono text-sm text-gray-700">
          The study showed{' '}
          <MarkerHighlight color="#fde047">strong user engagement</MarkerHighlight> with{' '}
          <MarkerHighlight color="#a7f3d0">skeuomorphic elements</MarkerHighlight> in
          the interface.
        </p>
      </Paper>
    </div>
  ),
}
