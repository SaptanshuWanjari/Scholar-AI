import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSwitch } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSwitch> = {
  title: 'Components/Inputs/PaperSwitch',
  component: PaperSwitch,
}

export default meta
type Story = StoryObj<typeof PaperSwitch>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperSwitch label="Dark Mode" />
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperSwitch label="Enabled" defaultChecked />
      <PaperSwitch label="Disabled" defaultChecked={false} />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <PaperSwitch label="Notifications" description="Send me updates" defaultChecked />
      <PaperSwitch label="Disabled on" checked disabled />
      <PaperSwitch label="Disabled off" checked={false} disabled />
    </div>
  ),
}
