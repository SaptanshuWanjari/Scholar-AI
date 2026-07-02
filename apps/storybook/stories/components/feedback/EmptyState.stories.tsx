import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from '@paper-ui/components/feedback';
import { SketchButton } from '@paper-ui/components/buttons';
import { FolderOpen } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No notebooks yet"
        description="Create a notebook to get started."
      />
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No notebooks yet"
        description="Create a notebook to get started."
        action={<SketchButton size="sm">New Notebook</SketchButton>}
      />
    </div>
  ),
};

export const Search: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <EmptyState
        title="No results found"
        description="Try different search terms."
      />
    </div>
  ),
};
