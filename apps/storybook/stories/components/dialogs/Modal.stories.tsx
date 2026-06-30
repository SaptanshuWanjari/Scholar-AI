import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperModal } from '@paper-ui/components/dialogs';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof PaperModal> = {
  title: 'Components/Dialogs/Modal',
  component: PaperModal,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">Open Modal</button>
        <PaperModal open={open} onClose={() => setOpen(false)} title="New Sketch">
          <p className="font-inter text-ink">Draw something beautiful here.</p>
        </PaperModal>
      </Box>
    );
  }
};

export const NoTitle: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-ochre-soft border border-black/20 rounded font-kalam">Simple Modal</button>
        <PaperModal open={open} onClose={() => setOpen(false)}>
          <div className="text-center py-8">
            <h3 className="font-kalam text-xl mb-2">Surprise!</h3>
            <p className="font-inter text-ink-muted">A modal without a title bar.</p>
          </div>
        </PaperModal>
      </Box>
    );
  }
};
