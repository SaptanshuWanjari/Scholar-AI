import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from '@paper-ui/components/navigation';
import { Search, Bell, User } from 'lucide-react';

const meta: Meta<typeof TopBar> = {
  title: 'Components/Navigation/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  render: () => (
    <div className="bg-[#f4f1ea] p-4">
      <TopBar start={<div className="font-kalam text-lg font-bold text-ink">StudyHub</div>}>
        <input
          type="text"
          placeholder="Search documents..."
          className="px-3 py-1.5 font-architect text-sm rounded-md border border-black/10 bg-white"
        />
        <button className="text-ink-muted hover:text-ink transition-colors">
          <Bell size={18} />
        </button>
        <button className="text-ink-muted hover:text-ink transition-colors">
          <User size={18} />
        </button>
      </TopBar>
    </div>
  ),
};
