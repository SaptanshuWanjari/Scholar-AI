import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperToast } from '@paper-ui/components/feedback';
import { SketchButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof PaperToast> = {
  title: 'Components/Feedback/PaperToast',
  component: PaperToast,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperToast>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperToast
        visible
        variant="default"
        message="Notification"
        description="This is an info message."
        onDismiss={() => {}}
        className="relative"
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      {(['default', 'success', 'warning', 'error'] as const).map((variant) => (
        <PaperToast
          key={variant}
          visible
          variant={variant}
          message={variant.charAt(0).toUpperCase() + variant.slice(1)}
          description="Toast message content here."
          onDismiss={() => {}}
          className="relative"
        />
      ))}
    </div>
  ),
};
