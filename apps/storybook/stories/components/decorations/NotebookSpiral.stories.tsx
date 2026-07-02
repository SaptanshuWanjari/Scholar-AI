import type { Meta, StoryObj } from '@storybook/react-vite'
import { NotebookSpiral } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof NotebookSpiral> = {
  title: 'Components/Decorations/NotebookSpiral',
  component: NotebookSpiral,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof NotebookSpiral>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-64 h-48 pt-6">
        <NotebookSpiral count={12} />
        <p className="font-mono text-sm text-center px-6 mt-4">Default, 12 rings.</p>
      </Paper>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-48 h-40 pt-6">
        <NotebookSpiral count={6} />
        <p className="font-mono text-xs text-center mt-3">6 rings</p>
      </Paper>
      <Paper className="w-64 h-48 pt-6">
        <NotebookSpiral count={12} />
        <p className="font-mono text-xs text-center mt-3">12 rings</p>
      </Paper>
      <Paper className="w-80 h-56 pt-6">
        <NotebookSpiral count={18} />
        <p className="font-mono text-xs text-center mt-3">18 rings</p>
      </Paper>
    </div>
  ),
}
