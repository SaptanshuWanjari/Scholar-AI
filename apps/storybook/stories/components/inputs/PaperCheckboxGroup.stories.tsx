import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCheckboxGroup } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperCheckboxGroup> = {
  title: 'Components/Inputs/PaperCheckboxGroup',
  component: PaperCheckboxGroup,
}

export default meta
type Story = StoryObj<typeof PaperCheckboxGroup>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperCheckboxGroup
        label="Topics"
        options={[
          { value: 'ml', label: 'Machine Learning' },
          { value: 'nlp', label: 'NLP' },
          { value: 'cv', label: 'Computer Vision' },
        ]}
        defaultValue={['ml']}
      />
    </div>
  ),
}

export const WithError: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <PaperCheckboxGroup
        label="Preferences"
        options={[
          { value: 'a', label: 'Option A' },
          { value: 'b', label: 'Option B' },
        ]}
        defaultValue={['a']}
      />
      <PaperCheckboxGroup
        label="With disabled"
        options={[
          { value: 'x', label: 'Available' },
          { value: 'y', label: 'Unavailable', disabled: true },
        ]}
      />
    </div>
  ),
}
