import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperButton } from '@paper-ui/components/buttons';
import { Plus, Download, Pencil } from 'lucide-react';

const meta: Meta<typeof PaperButton> = {
  title: 'Components/Buttons/PaperButton',
  component: PaperButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <PaperButton>Click me</PaperButton>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="space-y-4">
        <h3 className="font-architect text-sm font-semibold">Tones</h3>
        <div className="flex gap-3">
          <PaperButton tone="paper">Paper</PaperButton>
          <PaperButton tone="dark">Dark</PaperButton>
          <PaperButton tone="green">Green</PaperButton>
          <PaperButton tone="red">Red</PaperButton>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-architect text-sm font-semibold">Sizes</h3>
        <div className="flex gap-3 items-end">
          <PaperButton size="sm">Small</PaperButton>
          <PaperButton size="md">Medium</PaperButton>
          <PaperButton size="lg">Large</PaperButton>
        </div>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperButton tone="dark"><Plus size={16} /> New</PaperButton>
      <PaperButton tone="green"><Download size={16} /> Export</PaperButton>
      <PaperButton tone="paper"><Pencil size={16} /> Edit</PaperButton>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <PaperButton tone="dark" disabled>Disabled Dark</PaperButton>
      <PaperButton tone="paper" disabled>Disabled Paper</PaperButton>
    </div>
  ),
};
