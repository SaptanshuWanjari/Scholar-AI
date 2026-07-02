import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperStamp } from '@paper-ui/components/decorations'
import { Paper } from '@paper-ui/components/paper'

const meta: Meta<typeof PaperStamp> = {
  title: 'Components/Decorations/PaperStamp',
  component: PaperStamp,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PaperStamp>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-48 p-4">
        <PaperStamp label="DONE" position="top-right" />
        <p className="font-mono text-xs pt-8">Default, brick tone.</p>
      </Paper>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 justify-center flex-wrap">
      <Paper className="w-44 p-4">
        <PaperStamp label="APPROVED" tone="sage" position="center" />
        <p className="font-mono text-xs pt-10 text-center">sage</p>
      </Paper>
      <Paper className="w-44 p-4">
        <PaperStamp label="DRAFT" tone="ochre" position="center" />
        <p className="font-mono text-xs pt-10 text-center">ochre</p>
      </Paper>
      <Paper className="w-44 p-4">
        <PaperStamp label="REVIEW" tone="sky" position="center" />
        <p className="font-mono text-xs pt-10 text-center">sky</p>
      </Paper>
      <Paper className="w-44 p-4">
        <PaperStamp label="VOID" tone="ink" position="center" />
        <p className="font-mono text-xs pt-10 text-center">ink</p>
      </Paper>
    </div>
  ),
}
