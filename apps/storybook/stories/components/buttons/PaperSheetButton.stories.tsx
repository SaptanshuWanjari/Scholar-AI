import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperSheetButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof PaperSheetButton> = {
  title: 'Components/Buttons/PaperSheetButton',
  component: PaperSheetButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperSheetButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperSheetButton>Start Reading</PaperSheetButton>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <PaperSheetButton>Start Reading</PaperSheetButton>
      <PaperSheetButton>Continue Learning</PaperSheetButton>
      <PaperSheetButton>Bookmark</PaperSheetButton>
    </div>
  ),
};
