import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperDrawer } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperDrawer> = {
  title: 'Components/Dialogs/Drawer',
  component: PaperDrawer,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof PaperDrawer>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Right Drawer
        </button>
        <PaperDrawer open={open} onClose={() => setOpen(false)} title="Notes" side="right">
          <p className="font-kalam text-ink">Extra content from the right side.</p>
        </PaperDrawer>
      </div>
    );
  },
};

export const Positions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [side, setSide] = useState<'left' | 'right'>('right');
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setSide('left');
              setOpen(true);
            }}
            className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
          >
            Left Drawer
          </button>
          <button
            onClick={() => {
              setSide('right');
              setOpen(true);
            }}
            className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
          >
            Right Drawer
          </button>
        </div>
        <PaperDrawer open={open} onClose={() => setOpen(false)} title="Navigation" side={side}>
          <div className="flex flex-col gap-4 font-kalam">
            <span className="cursor-pointer hover:text-ink-muted">Home</span>
            <span className="cursor-pointer hover:text-ink-muted">Profile</span>
            <span className="cursor-pointer hover:text-ink-muted">Settings</span>
          </div>
        </PaperDrawer>
      </div>
    );
  },
};
