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

export const Bounce: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Bounce</h2>
      <div className="flex gap-10 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner variant="bounce" size={size} />
            <span className="font-mono text-xs text-gray-500">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Spin: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Spin</h2>
      <div className="flex gap-10 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner variant="spin" size={size} />
            <span className="font-mono text-xs text-gray-500">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Pulse: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Pulse</h2>
      <div className="flex gap-10 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner variant="pulse" size={size} />
            <span className="font-mono text-xs text-gray-500">{size}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Scribble: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Scribble</h2>
      <div className="flex gap-10 items-end">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Spinner variant="scribble" size={size} />
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
      <h2 className="font-architect text-xl font-bold">Spinner — With Label</h2>
      <div className="flex gap-10 items-end">
        <Spinner variant="bounce" size="md">
          <Spinner.Label>Loading your notes…</Spinner.Label>
        </Spinner>
        <Spinner variant="scribble" size="md">
          <Spinner.Label>Generating flashcards…</Spinner.Label>
        </Spinner>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Colors</h2>
      <div className="flex gap-8 items-end">
        {(['ink', 'sage', 'ochre', 'sky', 'brick'] as const).map(color => (
          <div key={color} className="flex flex-col items-center gap-2">
            <Spinner variant="bounce" size="md" color={color} />
            <span className="font-mono text-xs text-gray-500">{color}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Compound: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">Spinner — Compound Usage</h2>
      <Spinner variant="spin" size="lg" color="brick">
        <Spinner.Dot size="sm" color="ochre" />
        <Spinner.Label>Processing…</Spinner.Label>
      </Spinner>
    </div>
  ),
};
