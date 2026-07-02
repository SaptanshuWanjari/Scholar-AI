import type { Meta, StoryObj } from '@storybook/react-vite'
import { ShortcutKey } from '@paper-ui/components/inputs'

const meta: Meta<typeof ShortcutKey> = {
  title: 'Components/Inputs/ShortcutKey',
  component: ShortcutKey,
}

export default meta
type Story = StoryObj<typeof ShortcutKey>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-1">
      <ShortcutKey>⌘</ShortcutKey>
      <span className="text-ink-muted text-sm">K</span>
    </div>
  ),
}
