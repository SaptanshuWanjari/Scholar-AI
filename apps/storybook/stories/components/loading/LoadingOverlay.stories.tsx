import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingOverlay } from '@paper-ui/components/loading';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Components/Loading/LoadingOverlay',
  component: LoadingOverlay,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="relative w-72 h-40 bg-white rounded-lg border border-gray-300">
        <LoadingOverlay>
          <LoadingOverlay.Content message="Loading…" spinnerVariant="bounce" />
        </LoadingOverlay>
      </div>
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="relative w-72 h-48 bg-white rounded-lg border border-gray-300 p-4">
        <p className="font-kalam text-sm text-ink-muted">Content underneath</p>
        <LoadingOverlay blur>
          <LoadingOverlay.Backdrop opacity={0.5} />
          <LoadingOverlay.Content message="Processing…" spinnerVariant="spin" />
        </LoadingOverlay>
      </div>
    </div>
  ),
};
