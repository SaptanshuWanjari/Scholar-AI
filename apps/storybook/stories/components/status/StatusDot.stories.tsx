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
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <StatusDot status="online" />
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-4">
      {(['online', 'offline', 'away', 'busy', 'idle'] as const).map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <StatusDot status={s} />
          <span className="font-kalam text-[10px] text-ink-muted capitalize">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <StatusDot status="online" size="sm" />
      <StatusDot status="online" size="md" />
      <StatusDot status="online" size="lg" />
    </div>
  ),
};

export const WithPulse: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <StatusDot status="online" size="sm" pulse />
      <StatusDot status="online" size="md" pulse />
      <StatusDot status="online" size="lg" pulse />
    </div>
  ),
};
