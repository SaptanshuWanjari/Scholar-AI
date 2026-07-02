import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pill } from '@paper-ui/components/badges';
import { Star } from 'lucide-react';

const meta: Meta<typeof Pill> = {
  title: 'Components/Badges/Pill',
  component: Pill,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Pill>Pill</Pill>
    </div>
  ),
};

export const Removable: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Pill tone="lavender" onRemove={() => console.log('removed')}>
        Remove me
      </Pill>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-3">
        <Pill tone="ink">Ink</Pill>
        <Pill tone="sage" dot="#3f7a4e">Mastered</Pill>
        <Pill tone="ochre" dot="#b07a2e">Learning</Pill>
        <Pill tone="sky" icon={<Star size={10} />}>Starred</Pill>
        <Pill tone="brick" dot="#a3544a">Weak</Pill>
        <Pill tone="lavender">Lavender</Pill>
      </div>
    </div>
  ),
};
