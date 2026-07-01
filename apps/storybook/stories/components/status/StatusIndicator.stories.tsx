import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusIndicator } from '@paper-ui/components/status';

const meta: Meta<typeof StatusIndicator> = {
  title: 'Components/Status/StatusIndicator',
  component: StatusIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Default: Story = {
  args: { status: 'online', label: 'Online' },
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] min-h-screen">
      <div className="space-y-6">
        <h3 className="font-serif text-base font-bold">Simple (root + label)</h3>
        <div className="space-y-3">
          {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((s) => (
            <StatusIndicator key={s} status={s} label={s.charAt(0).toUpperCase() + s.slice(1)} size="md" />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold">Compound (Dot + Label)</h3>
        <div className="flex items-center gap-6">
          <StatusIndicator status="online">
            <StatusIndicator.Dot status="online" size="md" />
            <StatusIndicator.Label>Online</StatusIndicator.Label>
          </StatusIndicator>
          <StatusIndicator status="away">
            <StatusIndicator.Dot status="away" size="md" />
            <StatusIndicator.Label>Away</StatusIndicator.Label>
          </StatusIndicator>
          <StatusIndicator status="busy">
            <StatusIndicator.Dot status="busy" size="md" />
            <StatusIndicator.Label>Do not disturb</StatusIndicator.Label>
          </StatusIndicator>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold">With Pulse</h3>
        <div className="flex items-center gap-6">
          <StatusIndicator status="online" pulse size="lg" label="Active now" />
          <StatusIndicator status="online" pulse size="md" label="Online" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-serif text-base font-bold">Sizes</h3>
        <div className="flex items-center gap-6">
          <StatusIndicator status="online" size="sm" label="Small" />
          <StatusIndicator status="online" size="md" label="Medium" />
          <StatusIndicator status="online" size="lg" label="Large" />
        </div>
      </div>
    </div>
  ),
};
