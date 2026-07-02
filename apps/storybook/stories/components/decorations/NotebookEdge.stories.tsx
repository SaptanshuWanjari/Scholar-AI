import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookEdge } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof NotebookEdge> = {
  title: 'Components/Decorations/NotebookEdge',
  component: NotebookEdge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof NotebookEdge>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-64 h-40 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <p className="font-mono text-sm px-4">Default left edge.</p>
      </Paper>
    </div>
  ),
}

export const Positions: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-48 h-36 pl-10 pt-6">
        <NotebookEdge position="left" holes={12} />
        <p className="font-mono text-xs px-4">left</p>
      </Paper>
      <Paper className="w-64 h-24 pt-10">
        <NotebookEdge position="top" holes={8} />
        <p className="font-mono text-xs text-center">top</p>
      </Paper>
    </div>
  ),
}
