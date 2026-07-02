import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperModal } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperModal> = {
  title: 'Components/Dialogs/Modal',
  component: PaperModal,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof PaperModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Open Modal
        </button>
        <PaperModal open={open} onClose={() => setOpen(false)} title="New Sketch">
          <p className="font-kalam text-ink">Draw something beautiful here.</p>
        </PaperModal>
      </div>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-white border border-black/20 rounded font-kalam"
        >
          Create New
        </button>
        <PaperModal open={open} onClose={() => setOpen(false)} title="New Item">
          <div className="flex flex-col gap-4">
            <p className="font-kalam text-ink">Enter details:</p>
            <input
              type="text"
              placeholder="Name"
              className="px-3 py-2 border border-black/10 rounded font-kalam text-sm"
            />
            <textarea
              placeholder="Description"
              className="px-3 py-2 border border-black/10 rounded font-kalam text-sm"
              rows={3}
            />
          </div>
        </PaperModal>
      </div>
    );
  },
};
