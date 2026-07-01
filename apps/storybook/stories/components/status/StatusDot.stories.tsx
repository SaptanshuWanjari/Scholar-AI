import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '@paper-ui/components/status';

const meta: Meta<typeof StatusDot> = {
  title: 'Components/Status/StatusDot',
  component: StatusDot,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: { status: 'online' },
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] min-h-screen">
      <h2 className="font-serif text-xl font-bold">StatusDot — all statuses</h2>
      <div className="space-y-4">
        {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((status) => (
          <div key={status} className="flex items-center gap-4">
            <StatusDot status={status} />
            <StatusDot status={status} size="sm" />
            <StatusDot status={status} size="md" />
            <StatusDot status={status} size="lg" />
            <StatusDot status={status} pulse />
            <span className="font-kalam text-[13px] text-ink-muted capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
