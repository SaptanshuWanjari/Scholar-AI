import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@paper-ui/components/buttons';
import { Search, Bookmark, Star, Bell, Trash2 } from 'lucide-react';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Buttons/IconButton',
  component: IconButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <IconButton label="Search"><Search size={18} /></IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-3 items-center">
      <IconButton label="Small"><Search size={16} /></IconButton>
      <IconButton label="Medium"><Search size={18} /></IconButton>
      <IconButton label="Large"><Search size={20} /></IconButton>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <div className="flex gap-3">
        <IconButton label="Search"><Search size={18} /></IconButton>
        <IconButton label="Bookmark"><Bookmark size={18} /></IconButton>
        <IconButton label="Star"><Star size={18} /></IconButton>
        <IconButton label="Bell"><Bell size={18} /></IconButton>
        <IconButton label="Delete"><Trash2 size={18} /></IconButton>
      </div>
    </div>
  ),
};
