import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IllustratedEmptyState } from '@paper-ui/components/feedback';

const meta: Meta<typeof IllustratedEmptyState> = {
  title: 'Components/Feedback/IllustratedEmptyState',
  component: IllustratedEmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IllustratedEmptyState>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <IllustratedEmptyState
        illustration="notebook"
        title="No notebooks yet"
        description="Create a notebook to get started."
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="grid grid-cols-2 gap-6">
        {(['notebook', 'search', 'inbox', 'sparkle'] as const).map(illus => (
          <IllustratedEmptyState
            key={illus}
            illustration={illus}
            title={`${illus === 'sparkle' ? 'Empty' : illus.charAt(0).toUpperCase() + illus.slice(1)} empty`}
            description="Nothing to see here yet."
          />
        ))}
      </div>
    </div>
  ),
};
