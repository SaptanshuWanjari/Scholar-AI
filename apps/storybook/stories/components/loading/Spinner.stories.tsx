import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@paper-ui/components/loading';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Loading/Spinner',
  component: Spinner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-12 items-end">
        {(['bounce', 'spin', 'pulse', 'scribble'] as const).map(variant => (
          <div key={variant} className="flex flex-col items-center gap-3">
            <Spinner variant={variant} size="md" />
            <span className="font-mono text-xs text-gray-600">{variant}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-12 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-3">
            <Spinner variant="bounce" size={size} />
            <span className="font-mono text-xs text-gray-600">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Spinner variant="bounce">
        <Spinner.Dot />
        <Spinner.Label>Loading your notes…</Spinner.Label>
      </Spinner>
    </div>
  ),
};
