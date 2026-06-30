import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TopBar } from '@paper-ui/components/navigation';
import { Box } from '@paper-ui/components/layout';

const meta: Meta<typeof TopBar> = {
  title: 'Components/Navigation/TopBar',
  component: TopBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  render: () => (
    <Box className="w-full p-4 bg-[#f6f5f1]">
      <TopBar start={<div className="font-kalam font-bold text-lg">My Project</div>}>
        <button className="px-3 py-1 bg-white border border-black/10 rounded font-architect text-sm">Search</button>
      </TopBar>
    </Box>
  )
};

export const WithManyItems: Story = {
  render: () => (
    <Box className="w-full p-4 bg-paper">
      <TopBar start={<div className="font-architect font-bold text-xl">Dashboard</div>}>
        <div className="flex gap-4">
          <span className="font-kalam text-ink-muted">Alerts (3)</span>
          <span className="font-kalam text-ink">User Profile</span>
        </div>
      </TopBar>
    </Box>
  )
};

export const Minimalist: Story = {
  render: () => (
    <Box className="w-full p-4 bg-white border-b border-black/5">
      <TopBar start={<div className="font-inter font-medium tracking-widest uppercase text-sm">Minimal</div>} />
    </Box>
  )
};
