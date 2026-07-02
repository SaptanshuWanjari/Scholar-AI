import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tape } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof Tape> = {
  title: 'Components/Decorations/Tape',
  component: Tape,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Tape>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-64 p-4">
        <Tape corner="top-left" />
        <p className="font-mono text-sm">Default, top-left.</p>
      </Paper>
    </div>
  ),
}

export const Corners: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-48 p-4">
        <Tape corner="top-left" color="#e0cfa4" />
        <p className="font-mono text-xs text-center mt-2">top-left</p>
      </Paper>
      <Paper className="w-48 p-4">
        <Tape corner="top-center" color="#e0cfa4" />
        <p className="font-mono text-xs text-center mt-2">top-center</p>
      </Paper>
      <Paper className="w-48 p-4">
        <Tape corner="top-right" color="#f0d3a8" width={70} />
        <p className="font-mono text-xs text-center mt-2">top-right</p>
      </Paper>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-40 p-4">
        <Tape corner="top-left" color="var(--color-tape)" />
        <p className="font-mono text-xs text-center mt-2">default</p>
      </Paper>
      <Paper className="w-40 p-4">
        <Tape corner="top-left" color="#e0cfa4" />
        <p className="font-mono text-xs text-center mt-2">tan</p>
      </Paper>
      <Paper className="w-40 p-4">
        <Tape corner="top-left" color="#c8e6c9" />
        <p className="font-mono text-xs text-center mt-2">green</p>
      </Paper>
    </div>
  ),
}
