import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FloatingActionButton } from '@paper-ui/components/buttons';
import { Plus, Pencil } from 'lucide-react';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Components/Buttons/FloatingActionButton',
  component: FloatingActionButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FloatingActionButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <FloatingActionButton label="Add"><Plus size={20} /></FloatingActionButton>
    </div>
  ),
};

export const Extended: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <FloatingActionButton label="Add new" size="md" tone="dark"><Plus size={20} /> New</FloatingActionButton>
      <FloatingActionButton label="Edit item" size="md" tone="paper"><Pencil size={20} /> Edit</FloatingActionButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-8 items-center">
      <FloatingActionButton label="Small" size="sm" tone="dark"><Plus size={16} /></FloatingActionButton>
      <FloatingActionButton label="Medium" size="md" tone="green"><Plus size={20} /></FloatingActionButton>
      <FloatingActionButton label="Large" size="lg" tone="red"><Plus size={24} /></FloatingActionButton>
    </div>
  ),
};
