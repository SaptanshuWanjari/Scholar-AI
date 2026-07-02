import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu } from '@paper-ui/components/dialogs';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Dialogs/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ContextMenu
        items={[
          { key: 'copy', label: 'Copy' },
          { key: 'paste', label: 'Paste' },
          { key: 'delete', label: 'Delete', danger: true },
        ]}
      >
        <div className="flex h-40 w-full max-w-sm items-center justify-center rounded-md border border-dashed border-black/20 font-kalam text-sm bg-white">
          Right click here
        </div>
      </ContextMenu>
    </div>
  ),
};
