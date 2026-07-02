import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shimmer } from '@paper-ui/components/loading';

const meta: Meta<typeof Shimmer> = {
  title: 'Components/Loading/Shimmer',
  component: Shimmer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Shimmer>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Shimmer>
        <Shimmer.Card width={240} />
      </Shimmer>
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <Shimmer>
        <div className="flex gap-3 items-center mb-4">
          <Shimmer.Circle size={48} />
          <div className="flex-1 space-y-2">
            <Shimmer.Line />
            <Shimmer.Line width="80%" />
          </div>
        </div>
        <Shimmer.Block width="100%" height={80} />
      </Shimmer>
    </div>
  ),
};
