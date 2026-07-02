import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GhostButton } from '@paper-ui/components/buttons';
import { Trash2 } from 'lucide-react';

const meta: Meta<typeof GhostButton> = {
  title: 'Components/Buttons/GhostButton',
  component: GhostButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof GhostButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <GhostButton>Cancel</GhostButton>
    </div>
  ),
};

export const Active: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <GhostButton size="sm">Inactive</GhostButton>
      <GhostButton size="sm" className="text-ink -translate-y-px">Active</GhostButton>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <GhostButton size="sm"><Trash2 size={14} /> Delete</GhostButton>
      <GhostButton size="md">Secondary</GhostButton>
      <GhostButton size="lg">View All →</GhostButton>
    </div>
  ),
};
