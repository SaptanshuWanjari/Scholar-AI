import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperPopover } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperPopover> = {
  title: 'Components/Dialogs/Popover',
  component: PaperPopover,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperPopover>;

export const Default: Story = {
  render: () => (
    <div className="p-12">
      <PaperPopover
        trigger={<button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">Click Me</button>}
      >
        <div className="p-4">
          <h4 className="font-kalam text-lg font-bold">Popover Details</h4>
          <p className="font-inter text-sm mt-2">Some extra information displayed in a popover.</p>
        </div>
      </PaperPopover>
    </div>
  )
};

export const RichContent: Story = {
  render: () => (
    <div className="p-12">
      <PaperPopover
        trigger={<button className="px-4 py-2 bg-sky-soft border border-black/20 rounded font-architect">User Info</button>}
      >
        <div className="p-4 flex gap-4 items-center w-64">
          <div className="w-12 h-12 rounded-full bg-black/10"></div>
          <div>
            <div className="font-kalam font-bold text-lg">Jane Doe</div>
            <div className="font-inter text-sm text-ink-muted">jane@example.com</div>
          </div>
        </div>
      </PaperPopover>
    </div>
  )
};
