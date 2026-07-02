import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@paper-ui/components/navigation';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Navigation/Tabs',
  component: Tabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('overview');
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <Tabs
          active={active}
          onChange={setActive}
          items={[
            { key: 'overview', label: 'Overview', count: 12 },
            { key: 'content', label: 'Content', count: 5 },
            { key: 'notes', label: 'Notes', count: 8 }
          ]}
        />
        <div className="mt-6 p-4 font-kalam text-ink">Tab content for {active}</div>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [active, setActive] = useState('settings');
    return (
      <div className="p-8 bg-[#f4f1ea]">
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <Tabs
              active={active}
              onChange={setActive}
              className="flex-col items-start gap-1 border-r border-ink/8 pr-4"
              items={[
                { key: 'profile', label: 'Profile' },
                { key: 'settings', label: 'Settings' },
                { key: 'privacy', label: 'Privacy' }
              ]}
            />
          </div>
          <div className="flex-1">
            <p className="font-kalam text-ink">{active} settings would go here.</p>
          </div>
        </div>
      </div>
    );
  },
};
