import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof ToggleButton> = {
  title: 'Components/Buttons/ToggleButton',
  component: ToggleButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ToggleButton pressed={false} onPressedChange={() => {}}>
        Toggle
      </ToggleButton>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [pressed, setPressed] = useState(false);
    return (
      <div className="p-8 bg-[#f4f1ea] space-y-4">
        <div className="flex gap-3">
          <ToggleButton pressed={pressed} onPressedChange={setPressed}>
            {pressed ? 'ON' : 'OFF'}
          </ToggleButton>
        </div>
        <p className="text-sm font-mono text-gray-600">State: {String(pressed)}</p>
      </div>
    );
  },
};
