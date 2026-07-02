import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperBadge } from '@paper-ui/components/badges';

const meta: Meta<typeof PaperBadge> = {
  title: 'Components/Badges/PaperBadge',
  component: PaperBadge,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperBadge>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperBadge>Badge</PaperBadge>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-3">
        <PaperBadge tone="ink">Ink</PaperBadge>
        <PaperBadge tone="sage">Sage</PaperBadge>
        <PaperBadge tone="ochre">Ochre</PaperBadge>
        <PaperBadge tone="sky">Sky</PaperBadge>
        <PaperBadge tone="lavender">Lavender</PaperBadge>
        <PaperBadge tone="brick">Brick</PaperBadge>
      </div>
    </div>
  ),
};
