import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityIndicator } from '@paper-ui/components/status';

const meta: Meta<typeof ActivityIndicator> = {
  title: 'Components/Status/ActivityIndicator',
  component: ActivityIndicator,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ActivityIndicator>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <ActivityIndicator activity="typing" />
      <ActivityIndicator activity="active" />
      <ActivityIndicator activity="idle" />
    </div>
  ),
};

export const CustomLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <ActivityIndicator activity="typing" label="Writing a message…" />
      <ActivityIndicator activity="active" label="Online now" />
      <ActivityIndicator activity="idle" label="Away for 10 min" />
    </div>
  ),
};

export const DotSizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex items-center gap-6">
      <ActivityIndicator.Dots activity="typing" size="sm" />
      <ActivityIndicator.Dots activity="typing" size="md" />
      <ActivityIndicator.Dots activity="active" size="sm" />
      <ActivityIndicator.Dots activity="active" size="md" />
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ActivityIndicator>
        <ActivityIndicator.Dots activity="typing" size="md" />
        <ActivityIndicator.Label>Someone is typing…</ActivityIndicator.Label>
      </ActivityIndicator>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="p-3 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] w-56">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f0efed] flex items-center justify-center font-architect text-xs text-[#3a3733]">
            SC
          </div>
          <ActivityIndicator activity="typing" />
        </div>
      </div>
    </div>
  ),
};
