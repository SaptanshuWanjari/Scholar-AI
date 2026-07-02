import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperDropdown } from '@paper-ui/components/dialogs';

const meta: Meta<typeof PaperDropdown> = {
  title: 'Components/Dialogs/Dropdown',
  component: PaperDropdown,
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof PaperDropdown>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperDropdown
        trigger={
          <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">
            Actions ▾
          </button>
        }
        items={[
          { key: '1', label: 'Edit' },
          { key: '2', label: 'Share' },
          { key: '3', label: 'Delete', danger: true },
        ]}
      />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperDropdown
        trigger={
          <button className="px-4 py-2 bg-white border border-black/20 rounded font-kalam">
            Menu ▾
          </button>
        }
        items={[
          { key: '1', label: 'View', icon: '👁' },
          { key: '2', label: 'Edit', icon: '✏' },
          { key: '3', separator: true },
          { key: '4', label: 'Delete', icon: '🗑', danger: true },
        ]}
      />
    </div>
  ),
};
