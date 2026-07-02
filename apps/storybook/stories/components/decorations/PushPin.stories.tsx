import type { Meta, StoryObj } from '@storybook/react-vite'
import { PushPin } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PushPin> = {
  title: 'Components/Decorations/PushPin',
  component: PushPin,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PushPin>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-48 p-4 pt-8">
        <PushPin />
        <p className="font-mono text-xs text-center">Default, top-center.</p>
      </Paper>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-44 p-4 pt-8">
        <PushPin color="#c95f5f" />
        <p className="font-mono text-xs text-center mt-1">red</p>
      </Paper>
      <Paper className="w-44 p-4 pt-8">
        <PushPin color="#4a6f91" />
        <p className="font-mono text-xs text-center mt-1">blue</p>
      </Paper>
      <Paper className="w-44 p-4 pt-8">
        <PushPin color="#3f7a4e" />
        <p className="font-mono text-xs text-center mt-1">sage</p>
      </Paper>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-40 p-4 pt-6">
        <PushPin size={18} />
        <p className="font-mono text-xs text-center mt-2">small</p>
      </Paper>
      <Paper className="w-40 p-4 pt-8">
        <PushPin size={26} />
        <p className="font-mono text-xs text-center mt-1">medium</p>
      </Paper>
      <Paper className="w-40 p-4 pt-10">
        <PushPin size={32} />
        <p className="font-mono text-xs text-center mt-1">large</p>
      </Paper>
    </div>
  ),
}
