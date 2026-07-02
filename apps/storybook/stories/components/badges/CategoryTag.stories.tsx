import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CategoryTag } from '@paper-ui/components/badges';

const meta: Meta<typeof CategoryTag> = {
  title: 'Components/Badges/CategoryTag',
  component: CategoryTag,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CategoryTag>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <CategoryTag category="Science" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-3">
        <CategoryTag category="Science" />
        <CategoryTag category="History" tone="lavender" />
        <CategoryTag category="Mathematics" tone="sky" />
        <CategoryTag category="Literature" tone="sage" />
      </div>
    </div>
  ),
};
