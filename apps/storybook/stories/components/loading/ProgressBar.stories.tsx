import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '@paper-ui/components/loading';

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Loading/ProgressBar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-72">
      <ProgressBar value={65} tone="sage">
        <ProgressBar.Label>Course Progress</ProgressBar.Label>
        <ProgressBar.Percentage value={65} />
      </ProgressBar>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm space-y-5">
      {(['sage', 'ochre', 'sky', 'brick'] as const).map(tone => (
        <ProgressBar key={tone} value={50} tone={tone}>
          <ProgressBar.Label>{tone}</ProgressBar.Label>
          <ProgressBar.Percentage value={50} tone={tone} />
        </ProgressBar>
      ))}
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-72">
      <ProgressBar value={72} tone="sage">
        <ProgressBar.Label>Course Progress</ProgressBar.Label>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
        <ProgressBar.Percentage />
      </ProgressBar>
    </div>
  ),
};
