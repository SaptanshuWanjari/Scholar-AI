import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SketchSkeleton } from '@paper-ui/components/feedback';

const meta: Meta<typeof SketchSkeleton> = {
  title: 'Components/Feedback/SketchSkeleton',
  component: SketchSkeleton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SketchSkeleton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <SketchSkeleton variant="card" width="100%" height={180} />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex gap-3 items-center">
          <SketchSkeleton variant="circle" width={40} height={40} />
          <div className="flex-1">
            <SketchSkeleton variant="text" lines={2} />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Paragraph: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <SketchSkeleton variant="text" lines={4} />
    </div>
  ),
};
