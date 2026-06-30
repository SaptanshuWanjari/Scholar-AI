import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperCard, PaperPanel } from '@paper-ui/core'

const meta: Meta<typeof PaperCard> = {
  title: 'Core/PaperCard',
  component: PaperCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof PaperCard>

export const Default: Story = {
  args: { shadow: 'md', className: 'p-4 w-56' },
  render: (args) => (
    <PaperCard {...args}>
      <p className="font-kalam text-sm text-ink">A warm paper surface with a hand-drawn border.</p>
    </PaperCard>
  ),
}

export const ShadowVariants: Story = {
  render: () => (
    <div className="flex gap-6 flex-wrap items-start">
      {(['none', 'sm', 'md', 'lg'] as const).map((s) => (
        <PaperCard key={s} shadow={s} className="p-4 w-36">
          <p className="font-architect text-xs text-ink-muted uppercase tracking-widest mb-1">{s}</p>
          <p className="font-kalam text-sm text-ink">shadow={s}</p>
        </PaperCard>
      ))}
    </div>
  ),
}

export const WithLift: Story = {
  args: { shadow: 'md', lift: true, className: 'p-4 w-48' },
  render: (args) => (
    <PaperCard {...args}>
      <p className="font-kalam text-sm text-ink">Hover to see lift effect.</p>
    </PaperCard>
  ),
}

export const Rotated: Story = {
  args: { shadow: 'md', rotate: -2, className: 'p-4 w-48' },
  render: (args) => (
    <div className="p-8">
      <PaperCard {...args}>
        <p className="font-kalam text-sm text-ink">Slightly tilted note.</p>
      </PaperCard>
    </div>
  ),
}

export const Panel: Story = {
  render: () => (
    <PaperPanel className="p-4 w-48">
      <p className="font-kalam text-sm text-ink">Stroke-only inner panel.</p>
    </PaperPanel>
  ),
}
