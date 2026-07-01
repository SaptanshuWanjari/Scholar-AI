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

export const Line: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Shimmer — Line</h2>
      <div className="max-w-sm space-y-3">
        <Shimmer animated>
          <Shimmer.Line />
          <Shimmer.Line width="80%" />
          <Shimmer.Line width="60%" />
        </Shimmer>
        <p className="font-mono text-xs text-gray-500 mt-4">Non-animated</p>
        <Shimmer animated={false}>
          <Shimmer.Line />
          <Shimmer.Line width="80%" />
          <Shimmer.Line width="60%" />
        </Shimmer>
      </div>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Shimmer — Block</h2>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Shimmer>
            <Shimmer.Block width={160} height={100} />
          </Shimmer>
          <Shimmer>
            <Shimmer.Block width={200} height={60} />
          </Shimmer>
          <Shimmer>
            <Shimmer.Block width={120} height={120} />
          </Shimmer>
        </div>
      </div>
    </div>
  ),
};

export const Circle: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Shimmer — Circle</h2>
      <div className="flex flex-wrap gap-6 items-center">
        <Shimmer>
          <Shimmer.Circle size={32} />
        </Shimmer>
        <Shimmer>
          <Shimmer.Circle size={48} />
        </Shimmer>
        <Shimmer>
          <Shimmer.Circle size={64} />
        </Shimmer>
        <Shimmer>
          <Shimmer.Circle size={80} />
        </Shimmer>
      </div>
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Shimmer — Card</h2>
      <div className="flex flex-wrap gap-6">
        <Shimmer>
          <Shimmer.Card width={220} />
        </Shimmer>
        <Shimmer>
          <Shimmer.Card width={260} />
        </Shimmer>
        <Shimmer>
          <Shimmer.Card width={200} />
        </Shimmer>
      </div>
    </div>
  ),
};

export const ListLoading: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Shimmer — List Loading</h2>
      <div className="max-w-sm space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3 items-center">
            <Shimmer>
              <Shimmer.Circle size={40} />
            </Shimmer>
            <div className="flex-1">
              <Shimmer>
                <Shimmer.Line />
                <Shimmer.Line width="70%" />
              </Shimmer>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
