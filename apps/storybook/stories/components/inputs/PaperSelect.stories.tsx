import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSelect } from '@paper-ui/components/inputs'

const meta: Meta<typeof PaperSelect> = {
  title: 'Components/Inputs/PaperSelect',
  component: PaperSelect,
}

export default meta
type Story = StoryObj<typeof PaperSelect>

const OPTIONS = [
  { value: 'math', label: 'Mathematics' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'physics', label: 'Physics' },
  { value: 'history', label: 'History' },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-xs">
      <PaperSelect label="Subject" placeholder="Choose a subject…" options={OPTIONS} />
    </div>
  ),
}

export const WithPlaceholder: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-xs">
      <PaperSelect label="Level" placeholder="Select level…" options={[
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
      ]} />
      <PaperSelect label="Topic" placeholder="Pick a topic…" options={OPTIONS} />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4 max-w-xs">
      <PaperSelect label="Active" defaultValue="cs" options={OPTIONS} />
      <PaperSelect label="Disabled" disabled options={OPTIONS} />
    </div>
  ),
}
