import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DifficultyBadge } from '@paper-ui/components/badges';

const meta: Meta<typeof DifficultyBadge> = {
  title: 'Components/Badges/DifficultyBadge',
  component: DifficultyBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DifficultyBadge>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <DifficultyBadge difficulty="Medium" />
    </div>
  ),
};

export const AllLevels: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-3">
        <DifficultyBadge difficulty="Easy" />
        <DifficultyBadge difficulty="Medium" />
        <DifficultyBadge difficulty="Hard" />
      </div>
    </div>
  ),
};
