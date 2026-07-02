import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@paper-ui/components/layout';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9} className="p-8 bg-[#f4f1ea] max-w-2xl">
      <div className="w-full h-full bg-gradient-to-br from-sky-soft/30 to-lavender-soft/30 border-2 border-ink/20 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="font-architect text-2xl font-bold text-ink/50">16 : 9</div>
          <p className="font-kalam text-ink-muted mt-2">Video aspect ratio</p>
        </div>
      </div>
    </AspectRatio>
  ),
};

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1} className="p-8 bg-[#f4f1ea] max-w-xs">
      <div className="w-full h-full bg-gradient-to-br from-ochre-soft/30 to-brick-soft/30 border-2 border-ink/20 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="font-architect text-2xl font-bold text-ink/50">1 : 1</div>
          <p className="font-kalam text-ink-muted mt-2">Square</p>
        </div>
      </div>
    </AspectRatio>
  ),
};
