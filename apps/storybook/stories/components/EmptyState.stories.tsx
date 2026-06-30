import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataEmptyState } from '@paper-ui/components/dataDisplay';
import { PaperButton, SketchButton, GhostButton } from '@paper-ui/components/buttons';
import { FolderX, Inbox, SearchX } from 'lucide-react';

const meta = {
  title: 'Components/DataDisplay/EmptyState',
  component: DataEmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataEmptyState>;

export default meta;
type Story = StoryObj;

export const Sketch: Story = {
  args: {
    variant: 'sketch',
    title: 'No documents found',
    description: 'You haven\'t created any documents yet. Start by writing your first masterpiece.',
    icon: <FolderX size={48} strokeWidth={1.5} />,
    action: <SketchButton>Create Document</SketchButton>,
    className: 'w-[400px]',
  },
};

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    title: 'Nothing here...',
    description: 'This folder is completely empty. Try looking somewhere else or add new files.',
    icon: <Inbox size={48} strokeWidth={1.5} />,
    action: <PaperButton>Upload Files</PaperButton>,
    className: 'w-[400px]',
  },
};

export const Tape: Story = {
  args: {
    variant: 'tape',
    title: 'No search results',
    description: 'We couldn\'t find anything matching your query. Please try different keywords.',
    icon: <SearchX size={48} strokeWidth={1.5} />,
    action: <GhostButton>Clear Search</GhostButton>,
    className: 'w-[400px]',
  },
};
