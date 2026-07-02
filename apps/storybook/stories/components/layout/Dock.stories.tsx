import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dock } from '@paper-ui/components/layout';

const meta: Meta<typeof Dock> = {
  title: 'Components/Layout/Dock',
  component: Dock,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Dock>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] min-h-[300px] flex flex-col justify-end">
      <Dock className="border border-ink/20 bg-white rounded-lg p-4 max-w-2xl" gap={16}>
        {['A', 'B', 'C', 'D', 'E'].map((item) => (
          <div key={item} className="w-12 h-12 bg-sky-soft/20 border border-ink/20 rounded-full flex items-center justify-center font-architect font-bold text-ink/70 hover:scale-110 transition-transform">
            {item}
          </div>
        ))}
      </Dock>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center justify-center min-h-[250px]">
      <Dock className="border border-ink/20 bg-white rounded-lg p-4" gap={12}>
        {['1', '2', '3', '4'].map((item) => (
          <div key={item} className="w-10 h-10 bg-ochre-soft/20 border border-ink/20 rounded flex items-center justify-center font-kalam text-xs font-bold text-ink/60 hover:scale-125 transition-transform">
            {item}
          </div>
        ))}
      </Dock>
    </div>
  ),
};
