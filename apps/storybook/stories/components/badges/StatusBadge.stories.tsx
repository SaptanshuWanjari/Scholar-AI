import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from '@paper-ui/components/badges';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Badges/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <StatusBadge status="indexed" />
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-3">
        <StatusBadge status="indexed" />
        <StatusBadge status="processing" />
        <StatusBadge status="failed" />
      </div>
    </div>
  ),
};
