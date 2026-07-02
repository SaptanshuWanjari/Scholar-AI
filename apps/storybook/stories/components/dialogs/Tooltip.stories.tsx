import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperTooltip } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperTooltip> = {
  title: 'Components/Dialogs/Tooltip',
  component: PaperTooltip,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof PaperTooltip>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperTooltip content="Helpful information">
        <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">
          Hover Me
        </button>
      </PaperTooltip>
    </div>
  ),
};

export const Placements: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6">
      <PaperTooltip content="Top" placement="top">
        <button className="px-3 py-2 bg-white border border-black/20 rounded font-kalam text-sm">
          Top
        </button>
      </PaperTooltip>
      <PaperTooltip content="Bottom" placement="bottom">
        <button className="px-3 py-2 bg-white border border-black/20 rounded font-kalam text-sm">
          Bottom
        </button>
      </PaperTooltip>
      <PaperTooltip content="Left" placement="left">
        <button className="px-3 py-2 bg-white border border-black/20 rounded font-kalam text-sm">
          Left
        </button>
      </PaperTooltip>
      <PaperTooltip content="Right" placement="right">
        <button className="px-3 py-2 bg-white border border-black/20 rounded font-kalam text-sm">
          Right
        </button>
      </PaperTooltip>
    </div>
  ),
};
