import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperRadioGroup } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperRadioGroup> = {
  title: 'Components/Inputs/PaperRadioGroup',
  component: PaperRadioGroup,
}

export default meta
type Story = StoryObj<typeof PaperRadioGroup>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperRadioGroup
        label="Study Mode"
        name="study-mode"
        defaultValue="active"
        options={[
          { value: 'passive', label: 'Passive Reading' },
          { value: 'active', label: 'Active Recall' },
          { value: 'spaced', label: 'Spaced Repetition' },
        ]}
      />
    </div>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <PaperRadioGroup
        label="Layout (vertical)"
        name="layout"
        defaultValue="comfortable"
        orientation="vertical"
        options={[
          { value: 'compact', label: 'Compact' },
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'spacious', label: 'Spacious' },
        ]}
      />
      <PaperRadioGroup
        label="Theme (horizontal)"
        name="theme"
        defaultValue="system"
        orientation="horizontal"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'system', label: 'System' },
        ]}
      />
    </div>
  ),
}
