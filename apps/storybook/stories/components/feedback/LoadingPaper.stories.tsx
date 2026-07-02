import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingPaper } from '@paper-ui/components/feedback';

const meta: Meta<typeof LoadingPaper> = {
  title: 'Components/Feedback/LoadingPaper',
  component: LoadingPaper,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LoadingPaper>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <LoadingPaper variant="dots" size="md" />
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <LoadingPaper variant="spinner" size="md" label="Processing your document…" />
    </div>
  ),
};
