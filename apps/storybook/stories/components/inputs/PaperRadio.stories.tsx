import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperRadio } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperRadio> = {
  title: 'Components/Inputs/PaperRadio',
  component: PaperRadio,
}

export default meta
type Story = StoryObj<typeof PaperRadio>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperRadio value="opt1" label="Option 1" />
    </div>
  ),
}

export const Selected: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperRadio value="opt1" selectedValue="opt1" label="Selected" />
      <PaperRadio value="opt2" selectedValue="opt1" label="Not selected" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperRadio value="opt1" disabled label="Disabled" />
      <PaperRadio value="opt2" disabled selectedValue="opt2" label="Disabled selected" />
    </div>
  ),
}
