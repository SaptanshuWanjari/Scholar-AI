import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorCard } from '@paper-ui/components/feedback';

const meta: Meta<typeof ErrorCard> = {
  title: 'Components/Feedback/ErrorCard',
  component: ErrorCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ErrorCard>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <ErrorCard title="Upload failed" message="The PDF could not be processed." />
    </div>
  ),
};

export const WithRetry: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <ErrorCard
        title="Processing error"
        message="Failed to extract text from document."
        onRetry={() => console.log('retrying…')}
      />
    </div>
  ),
};

export const NetworkError: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <ErrorCard
        title="Network error"
        message="Could not reach the server."
        details="ERR_CONNECTION_REFUSED at api.example.com:8000"
      />
    </div>
  ),
};
