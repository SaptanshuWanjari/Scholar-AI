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
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <StatusIndicator status="online" label="Online" />
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((s) => (
        <StatusIndicator key={s} status={s} label={s.charAt(0).toUpperCase() + s.slice(1)} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <StatusIndicator status="online" size="sm" label="Small" />
      <StatusIndicator status="online" size="md" label="Medium" />
      <StatusIndicator status="online" size="lg" label="Large" />
    </div>
  ),
};

export const WithPulse: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <StatusIndicator status="online" pulse size="md" label="Active now" />
      <StatusIndicator status="online" pulse size="lg" label="Live session" />
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <StatusIndicator status="online">
        <StatusIndicator.Dot status="online" size="md" />
        <StatusIndicator.Label>Study session active</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator status="away">
        <StatusIndicator.Dot status="away" size="md" />
        <StatusIndicator.Label>Taking a break</StatusIndicator.Label>
      </StatusIndicator>
      <StatusIndicator status="busy">
        <StatusIndicator.Dot status="busy" size="md" />
        <StatusIndicator.Label>In exam mode</StatusIndicator.Label>
      </StatusIndicator>
    </div>
  ),
};
