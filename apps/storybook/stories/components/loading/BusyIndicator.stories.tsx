import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BusyIndicator } from '@paper-ui/components/loading';

const meta: Meta<typeof BusyIndicator> = {
  title: 'Components/Loading/BusyIndicator',
  component: BusyIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BusyIndicator>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex gap-8 items-end">
        {(['spin', 'pulse', 'dots'] as const).map(variant => (
          <div key={variant} className="flex flex-col items-center gap-2">
            <BusyIndicator variant={variant} size="sm" />
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
      <div className="flex gap-10 items-end">
        {(['xs', 'sm', 'md'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <BusyIndicator size={size} />
            <span className="font-mono text-xs text-gray-600">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Inline: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <div className="flex items-center gap-2 font-kalam text-sm text-ink-muted">
        <BusyIndicator size="xs" variant="dots" />
        Generating response…
      </div>
      <div className="flex items-center gap-2 font-kalam text-sm text-ink-muted">
        <BusyIndicator size="xs" variant="spin" />
        Saving changes…
      </div>
    </div>
  ),
};
