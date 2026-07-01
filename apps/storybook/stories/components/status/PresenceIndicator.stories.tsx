import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PresenceIndicator } from '@paper-ui/components/status';

const meta: Meta<typeof PresenceIndicator> = {
  title: 'Components/Status/PresenceIndicator',
  component: PresenceIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PresenceIndicator>;

export const Default: Story = {
  args: { name: 'Jane Doe', status: 'online' },
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] min-h-screen">
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">All statuses</h3>
        <div className="space-y-4">
          {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((s) => (
            <PresenceIndicator
              key={s}
              name={`User ${s}`}
              status={s}
              size="md"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Sizes</h3>
        <div className="flex items-end gap-8">
          <PresenceIndicator name="Alice" status="online" size="sm" />
          <PresenceIndicator name="Bob" status="away" size="md" />
          <PresenceIndicator name="Charlie" status="busy" size="lg" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Compound (Avatar + Badge + Label)</h3>
        <div className="space-y-4">
          <PresenceIndicator name="Demo" status="online" size="md">
            <span className="relative inline-flex shrink-0" style={{ width: 44, height: 44 }}>
              <PresenceIndicator.Avatar name="Demo" size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 z-[3]">
                <PresenceIndicator.Badge status="online" size="md" />
              </span>
            </span>
            <div className="flex flex-col">
              <PresenceIndicator.Label>Demo User</PresenceIndicator.Label>
              <span className="font-kalam text-[11px] text-ink-muted">Active now</span>
            </div>
          </PresenceIndicator>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Use case — user list</h3>
        <div className="space-y-3 p-4 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] max-w-xs">
          <PresenceIndicator name="Sarah Chen" status="online" size="sm" />
          <PresenceIndicator name="Mike Rivera" status="away" size="sm" />
          <PresenceIndicator name="Alex Kim" status="offline" size="sm" />
        </div>
      </div>
    </div>
  ),
};
