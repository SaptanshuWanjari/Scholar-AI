import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypeTag } from '@paper-ui/components/badges';

const meta: Meta<typeof TypeTag> = {
  title: 'Components/Badges/TypeTag',
  component: TypeTag,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TypeTag>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <TypeTag type="pdf" />
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex flex-wrap gap-3">
        <TypeTag type="pdf" />
        <TypeTag type="markdown" />
        <TypeTag type="docx" />
        <TypeTag type="txt" />
      </div>
    </div>
  ),
};
