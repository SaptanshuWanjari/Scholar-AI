import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BusyIndicator } from '@paper-ui/components/loading';
import { SketchButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof BusyIndicator> = {
  title: 'Components/Loading/BusyIndicator',
  component: BusyIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BusyIndicator>;

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">BusyIndicator — Variants</h2>
      <div className="flex gap-8 items-end">
        {(['spin', 'pulse', 'dots'] as const).map(variant => (
          <div key={variant} className="flex flex-col items-center gap-2">
            <BusyIndicator variant={variant} />
            <span className="font-mono text-xs text-gray-500">{variant}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">BusyIndicator — Sizes</h2>
      <div className="flex gap-8 items-end">
        {(['xs', 'sm', 'md'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <BusyIndicator size={size} />
            <span className="font-mono text-xs text-gray-500">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">BusyIndicator — With Label</h2>
      <div className="flex flex-wrap gap-6 items-center">
        <BusyIndicator variant="spin" label="Saving…" />
        <BusyIndicator variant="pulse" label="Listening…" />
        <BusyIndicator variant="dots" label="Typing…" size="md" />
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">BusyIndicator — Colors</h2>
      <div className="flex gap-6 items-end">
        {(['ink', 'sage', 'ochre', 'sky', 'brick'] as const).map(color => (
          <div key={color} className="flex flex-col items-center gap-2">
            <BusyIndicator color={color} />
            <span className="font-mono text-xs text-gray-500">{color}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const InlineUsage: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">BusyIndicator — Inline Usage</h2>
      <div className="space-y-3">
        <SketchButton disabled>
          <BusyIndicator size="xs" color="ink" /> Saving…
        </SketchButton>
        <div className="flex items-center gap-2 font-kalam text-sm text-ink-muted">
          <BusyIndicator variant="dots" size="xs" />
          AI is generating a response…
        </div>
      </div>
    </div>
  ),
};
