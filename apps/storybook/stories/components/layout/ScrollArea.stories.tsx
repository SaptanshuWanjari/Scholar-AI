import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@paper-ui/components/layout';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ScrollArea maxHeight={300} className="border border-ink/20 rounded bg-white p-4">
        <div className="space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="font-kalam text-ink-muted py-2 border-b border-ink/10">
              Item {i + 1}: Scrollable content area
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ScrollArea maxHeight={150} className="border border-ink/20 rounded bg-white overflow-x-auto">
        <div className="flex gap-4 p-4 w-max">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-40 p-4 bg-sky-soft/20 border border-ink/20 rounded text-center">
              <div className="font-kalam text-ink-muted">Card {i + 1}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};
