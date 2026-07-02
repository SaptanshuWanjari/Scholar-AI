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
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PresenceIndicator name="Jane Doe" status="online" />
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((s) => (
        <PresenceIndicator key={s} name={`User — ${s}`} status={s} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-end gap-8">
      <PresenceIndicator name="Alice" status="online" size="sm" />
      <PresenceIndicator name="Bob" status="away" size="md" />
      <PresenceIndicator name="Charlie" status="busy" size="lg" />
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PresenceIndicator name="Demo" status="online" size="md">
        <span className="relative inline-flex shrink-0" style={{ width: 44, height: 44 }}>
          <PresenceIndicator.Avatar name="Demo" size="md" />
          <span className="absolute -bottom-0.5 -right-0.5 z-[3]">
            <PresenceIndicator.Badge status="online" size="md" />
          </span>
        </span>
        <div className="flex flex-col">
          <PresenceIndicator.Label>Sarah Chen</PresenceIndicator.Label>
          <span className="font-kalam text-[11px] text-ink-muted">Active now</span>
        </div>
      </PresenceIndicator>
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="space-y-3 p-4 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] w-56">
        <PresenceIndicator name="Sarah Chen" status="online" size="sm" />
        <PresenceIndicator name="Mike Rivera" status="away" size="sm" />
        <PresenceIndicator name="Alex Kim" status="offline" size="sm" />
      </div>
    </div>
  ),
};
