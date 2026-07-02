import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchSearch } from '@paper-ui/components/inputs'

const meta: Meta<typeof SketchSearch> = {
  title: 'Components/Inputs/SketchSearch',
  component: SketchSearch,
}

export default meta
type Story = StoryObj<typeof SketchSearch>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <SketchSearch placeholder="Search documents, concepts, sessions…" width={400} />
    </div>
  ),
}

export const WithResults: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <SketchSearch placeholder="Wide search" width={400} />
      <SketchSearch placeholder="Narrow search" width={280} shortcut={null} />
    </div>
  ),
}
