import type { Meta, StoryObj } from '@storybook/react-vite'
import { CoffeeRing } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof CoffeeRing> = {
  title: 'Components/Decorations/CoffeeRing',
  component: CoffeeRing,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CoffeeRing>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <CoffeeRing size={64} position="bottom-right" />
        <p className="font-mono text-xs relative z-10">Default ring.</p>
      </Paper>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-48 p-4">
        <CoffeeRing size={50} position="bottom-right" opacity={0.2} />
        <p className="font-mono text-xs relative z-10">small</p>
      </Paper>
      <Paper className="w-48 p-4">
        <CoffeeRing size={64} position="bottom-right" opacity={0.2} />
        <p className="font-mono text-xs relative z-10">medium</p>
      </Paper>
      <Paper className="w-48 p-4">
        <CoffeeRing size={100} position="bottom-right" opacity={0.25} />
        <p className="font-mono text-xs relative z-10">large</p>
      </Paper>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-72 p-8">
        <CoffeeRing size={80} position="bottom-right" opacity={0.25} />
        <h3 className="font-serif text-lg font-bold mb-2 relative z-10">Work Diary</h3>
        <p className="font-mono text-sm text-gray-700 relative z-10">
          Coffee rings trace the timeline of late-night edits and revisions.
        </p>
      </Paper>
    </div>
  ),
}
