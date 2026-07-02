import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '@paper-ui/components/utility'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Utility/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Avatar>

const TONES = ['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as const
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Avatar name="Ada Lovelace" tone="sage" size="lg" />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Avatar name="Ada Lovelace" tone="sage" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Sizes</p>
        <div className="flex items-end gap-4">
          {SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Avatar name="Ada Lovelace" tone="sage" size={s} />
              <span className="font-architect text-[10px] text-ink-muted/50">{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Tones</p>
        <div className="flex items-center gap-4">
          {TONES.map((t) => (
            <Avatar key={t} name="Ada Lovelace" tone={t} size="md" />
          ))}
        </div>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-8">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">With image (sage tone)</p>
        <div className="flex items-center gap-4">
          {SIZES.map((s) => (
            <Avatar
              key={s}
              name="Ada Lovelace"
              tone="sage"
              size={s}
              src="https://picsum.photos/seed/ada/100/100"
            />
          ))}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Initials fallback (no src)</p>
        <div className="flex items-center gap-4">
          {TONES.map((t) => (
            <Avatar key={t} name="Ada Lovelace" tone={t} size="md" />
          ))}
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Anonymous fallback (no name, no src)</p>
        <div className="flex items-center gap-4">
          {SIZES.map((s) => (
            <Avatar key={s} size={s} tone="ink" />
          ))}
        </div>
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-6">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Different tones in a row</p>
        <div className="flex items-center gap-3">
          <Avatar name="Ada Lovelace" tone="sage" size="md" />
          <Avatar name="Alan Turing" tone="ochre" size="md" />
          <Avatar name="Grace Hopper" tone="sky" size="md" />
          <Avatar name="John von Neumann" tone="lavender" size="md" />
          <Avatar name="Margaret Hamilton" tone="brick" size="md" />
          <Avatar name="Linus Torvalds" tone="ink" size="md" />
        </div>
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-3">Mixed image + initials in row</p>
        <div className="flex items-center gap-3">
          <Avatar
            name="Ada Lovelace"
            tone="sage"
            size="md"
            src="https://picsum.photos/seed/ada/100/100"
          />
          <Avatar name="Alan Turing" tone="ochre" size="md" />
          <Avatar
            name="Grace Hopper"
            tone="sky"
            size="md"
            src="https://picsum.photos/seed/grace/100/100"
          />
          <Avatar name="John von Neumann" tone="lavender" size="md" />
        </div>
      </section>
    </div>
  ),
}
