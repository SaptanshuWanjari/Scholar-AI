import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmationDialog } from '@paper-ui/components/dialogs';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof ConfirmationDialog> = {
  title: 'Components/Dialogs/ConfirmationDialog',
  component: ConfirmationDialog,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ConfirmationDialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">Open Confirm</button>
        <ConfirmationDialog
          open={open}
          onCancel={() => setOpen(false)}
          title="Delete Document?"
          message="Are you sure you want to delete this document? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => setOpen(false)}
          destructive
        />
      </Box>
    );
  }
};

export const SafeAction: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <Box>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-sage-soft border border-black/20 rounded font-kalam">Submit Changes</button>
        <ConfirmationDialog
          open={open}
          onCancel={() => setOpen(false)}
          title="Publish Changes"
          message="Your changes are ready to go live. Proceed?"
          confirmLabel="Publish"
          onConfirm={() => setOpen(false)}
        />
      </Box>
    );
  }
};
