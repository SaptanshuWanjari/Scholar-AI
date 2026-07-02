import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperTextarea } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperTextarea> = {
  title: 'Components/Inputs/PaperTextarea',
  component: PaperTextarea,
}

export default meta
type Story = StoryObj<typeof PaperTextarea>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <PaperTextarea label="Notes" placeholder="Write your notes here…" rows={4} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-sm">
      <PaperTextarea label="Short" placeholder="Brief note…" rows={2} />
      <PaperTextarea label="Medium" placeholder="A longer entry…" rows={5} />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-sm">
      <PaperTextarea label="With hint" hint="Markdown supported." rows={3} />
      <PaperTextarea label="With error" error="Too short." rows={2} />
      <PaperTextarea label="Disabled" disabled rows={3} />
    </div>
  ),
}
