import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperClip } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PaperClip> = {
  title: 'Components/Decorations/PaperClip',
  component: PaperClip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperClip>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-48 p-4 pt-8">
        <PaperClip />
        <p className="font-mono text-xs text-center">Default, top-left.</p>
      </Paper>
    </div>
  ),
}

export const Orientations: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-40 p-4 pt-8">
        <PaperClip position="top-left" />
        <p className="font-mono text-xs text-center mt-2">top-left</p>
      </Paper>
      <Paper className="w-40 p-4 pt-8">
        <PaperClip position="top-center" />
        <p className="font-mono text-xs text-center mt-2">top-center</p>
      </Paper>
      <Paper className="w-40 p-4 pt-8">
        <PaperClip position="top-right" />
        <p className="font-mono text-xs text-center mt-2">top-right</p>
      </Paper>
    </div>
  ),
}
