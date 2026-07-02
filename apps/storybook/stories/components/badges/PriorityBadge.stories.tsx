import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PriorityBadge } from '@paper-ui/components/badges';

const meta: Meta<typeof PriorityBadge> = {
  title: 'Components/Badges/PriorityBadge',
  component: PriorityBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PriorityBadge>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PriorityBadge priority="medium" />
    </div>
  ),
};

export const AllPriorities: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-3">
        <PriorityBadge priority="low" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="high" />
        <PriorityBadge priority="critical" />
      </div>
    </div>
  ),
};
