import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SketchButton } from '@paper-ui/components/buttons';
import { Search } from 'lucide-react';

const meta: Meta<typeof SketchButton> = {
  title: 'Components/Buttons/SketchButton',
  component: SketchButton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof SketchButton>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <SketchButton>Click me</SketchButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <SketchButton size="sm">Small</SketchButton>
      <SketchButton size="md">Medium</SketchButton>
      <SketchButton size="lg">Large</SketchButton>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <SketchButton tone="paper">Paper</SketchButton>
      <SketchButton tone="dark">Dark</SketchButton>
      <SketchButton tone="green">Green</SketchButton>
      <SketchButton tone="red">Red</SketchButton>
    </div>
  ),
};
