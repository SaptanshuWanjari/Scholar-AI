import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StickyButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof StickyButton> = {
  title: 'Components/Buttons/StickyButton',
  component: StickyButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StickyButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <StickyButton>Ask AI</StickyButton>
    </div>
  ),
};

export const Positions: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="flex gap-8 items-end">
        <StickyButton tone="paper">Ask AI</StickyButton>
        <StickyButton tone="dark">Teach Me</StickyButton>
        <StickyButton tone="green">Generate</StickyButton>
        <StickyButton tone="red" taped={false}>Action</StickyButton>
      </div>
    </div>
  ),
};
