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
  args: { label: 'Online' },
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] min-h-screen">
      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Default</h3>
        <OnlineIndicator label="Online" />
        <OnlineIndicator label="Active now — editing" size="lg" />
        <OnlineIndicator size="sm" />
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Sizes</h3>
        <div className="flex items-center gap-6">
          <OnlineIndicator size="sm" label="Small" />
          <OnlineIndicator size="md" label="Medium" />
          <OnlineIndicator size="lg" label="Large" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Compound (Dot + Label)</h3>
        <OnlineIndicator>
          <OnlineIndicator.Dot size="md" />
          <OnlineIndicator.Label>Online now</OnlineIndicator.Label>
        </OnlineIndicator>
      </div>

      <div className="space-y-4">
        <h3 className="font-serif text-base font-bold">Use case — next to username</h3>
        <div className="flex items-center gap-4 p-4 bg-[#fffdf9] rounded-lg border border-[#e4e0d6] max-w-xs">
          <div className="w-9 h-9 rounded-full bg-[#f0efed] flex items-center justify-center font-architect font-medium text-[#3a3733] text-sm">
            JD
          </div>
          <div className="flex flex-col">
            <span className="font-kalam text-sm text-[#3a3733]">Jane Doe</span>
            <OnlineIndicator size="sm" />
          </div>
        </div>
      </div>
    </div>
  ),
};
