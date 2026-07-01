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
  args: { activity: 'typing' },
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] min-h-screen">
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Activity types</h3>
        <div className="space-y-4">
          <ActivityIndicator activity="typing" />
          <ActivityIndicator activity="active" />
          <ActivityIndicator activity="idle" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Custom label</h3>
        <div className="space-y-4">
          <ActivityIndicator activity="typing" label="Writing a message…" />
          <ActivityIndicator activity="active" label="Online" />
          <ActivityIndicator activity="idle" label="Away for 10 min" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Compound (Dots + Label)</h3>
        <ActivityIndicator>
          <ActivityIndicator.Dots activity="typing" size="sm" />
          <ActivityIndicator.Label>Someone is typing…</ActivityIndicator.Label>
        </ActivityIndicator>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Dots sizes</h3>
        <div className="flex items-center gap-6">
          <ActivityIndicator.Dots activity="typing" size="sm" />
          <ActivityIndicator.Dots activity="typing" size="md" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Use case — chat footer</h3>
        <div className="p-3 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#f0efed] flex items-center justify-center font-architect text-xs text-[#3a3733]">
              JD
            </div>
            <ActivityIndicator activity="typing" />
          </div>
        </div>
      </div>
    </div>
  ),
};
