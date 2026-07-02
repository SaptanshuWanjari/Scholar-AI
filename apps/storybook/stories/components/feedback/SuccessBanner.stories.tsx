import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessBanner } from '@paper-ui/components/feedback';

const meta: Meta<typeof SuccessBanner> = {
  title: 'Components/Feedback/SuccessBanner',
  component: SuccessBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SuccessBanner>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <SuccessBanner title="Success" message="Your document has been processed." />
    </div>
  ),
};

export const Dismissable: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <div className="p-8 bg-[#f4f1ea]">
        <SuccessBanner
          title="Changes saved"
          message="Your progress has been backed up."
          onDismiss={() => setVisible(false)}
        />
      </div>
    ) : (
      <div className="p-8 bg-[#f4f1ea]">
        <p className="text-sm text-ink-muted">Banner dismissed. Reload to see it again.</p>
      </div>
    );
  },
};
