import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCheckbox } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperCheckbox> = {
  title: 'Components/Inputs/PaperCheckbox',
  component: PaperCheckbox,
}

export default meta
type Story = StoryObj<typeof PaperCheckbox>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperCheckbox label="I agree to the terms" />
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperCheckbox label="Checked" defaultChecked />
      <PaperCheckbox label="Unchecked" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperCheckbox label="Disabled unchecked" disabled />
      <PaperCheckbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
}
