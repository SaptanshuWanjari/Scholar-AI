import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnlineIndicator } from '@paper-ui/components/status';

const meta: Meta<typeof OnlineIndicator> = {
  title: 'Components/Status/OnlineIndicator',
  component: OnlineIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof OnlineIndicator>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <OnlineIndicator label="Online" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <OnlineIndicator size="sm" label="Small" />
      <OnlineIndicator size="md" label="Medium" />
      <OnlineIndicator size="lg" label="Large" />
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <OnlineIndicator>
        <OnlineIndicator.Dot size="md" />
        <OnlineIndicator.Label>Active now</OnlineIndicator.Label>
      </OnlineIndicator>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="flex items-center gap-4 p-4 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] w-64">
        <div className="w-9 h-9 rounded-full bg-[#f0efed] flex items-center justify-center font-architect font-medium text-[#3a3733] text-sm">
          JD
        </div>
        <div className="flex flex-col">
          <span className="font-kalam text-sm text-[#3a3733]">Jane Doe</span>
          <OnlineIndicator size="sm" />
        </div>
      </div>
    </div>
  ),
};
