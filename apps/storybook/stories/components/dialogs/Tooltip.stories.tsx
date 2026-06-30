import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperTooltip } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperTooltip> = {
  title: 'Components/Dialogs/Tooltip',
  component: PaperTooltip,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperTooltip>;

export const Default: Story = {
  render: () => (
    <div className="p-10 flex gap-4">
      <PaperTooltip content="This is a helpful tip!">
        <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">Hover Me</button>
      </PaperTooltip>
    </div>
  )
};

export const MultipleTooltips: Story = {
  render: () => (
    <div className="p-10 flex gap-4">
      <PaperTooltip content="Save document">
        <button className="p-2 border border-black/20 rounded bg-sage-soft">Save</button>
      </PaperTooltip>
      <PaperTooltip content="Delete document">
        <button className="p-2 border border-black/20 rounded bg-red-100">Del</button>
      </PaperTooltip>
    </div>
  )
};
