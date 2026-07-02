import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperLabel, PaperInput } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperLabel> = {
  title: 'Components/Inputs/PaperLabel',
  component: PaperLabel,
}

export default meta
type Story = StoryObj<typeof PaperLabel>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperLabel>Single label</PaperLabel>
    </div>
  ),
}

export const Required: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <PaperLabel required>Email (required)</PaperLabel>
      <PaperLabel required>Full Name</PaperLabel>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm space-y-4">
      <div>
        <PaperLabel className="mb-2 block">Active Input</PaperLabel>
        <PaperInput placeholder="Can edit" />
      </div>
      <div>
        <PaperLabel className="mb-2 block opacity-50">Disabled Input</PaperLabel>
        <PaperInput placeholder="Cannot edit" disabled />
      </div>
    </div>
  ),
}
