import type { Meta, StoryObj } from '@storybook/react-vite'
import { Scribble } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof Scribble> = {
  title: 'Components/Decorations/Scribble',
  component: Scribble,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Scribble>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <p className="font-mono text-xs mb-2">Underline mark:</p>
        <Scribble className="h-4 w-24" />
      </Paper>
    </div>
  ),
}

export const Styles: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-72 p-6 space-y-4">
        <div>
          <p className="font-mono text-xs mb-1">Blue, default</p>
          <Scribble className="h-4 w-40" color="#3b82f6" />
        </div>
        <div>
          <p className="font-mono text-xs mb-1">Red, thick</p>
          <Scribble className="h-4 w-40" color="#ef4444" strokeWidth={3} />
        </div>
        <div>
          <p className="font-mono text-xs mb-1">Green, thin</p>
          <Scribble className="h-4 w-40" color="#22c55e" strokeWidth={1} />
        </div>
      </Paper>
    </div>
  ),
}
