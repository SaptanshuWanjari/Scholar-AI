import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperPopover } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperPopover> = {
  title: 'Components/Dialogs/Popover',
  component: PaperPopover,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof PaperPopover>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperPopover
        trigger={
          <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">
            Click Me
          </button>
        }
      >
        <div className="flex flex-col gap-2">
          <h4 className="font-kalam font-bold">Information</h4>
          <p className="font-kalam text-sm">Extra details in a popover.</p>
        </div>
      </PaperPopover>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperPopover
        trigger={
          <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">
            Options
          </button>
        }
        placement="bottom"
      >
        <div className="flex flex-col gap-2">
          <button className="px-3 py-1.5 text-left text-sm font-kalam hover:bg-black/5 rounded">
            View
          </button>
          <button className="px-3 py-1.5 text-left text-sm font-kalam hover:bg-black/5 rounded">
            Edit
          </button>
          <button className="px-3 py-1.5 text-left text-sm font-kalam text-[#9f3a36] hover:bg-black/5 rounded">
            Delete
          </button>
        </div>
      </PaperPopover>
    </div>
  ),
};
