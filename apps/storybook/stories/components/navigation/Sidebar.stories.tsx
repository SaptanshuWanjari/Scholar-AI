import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaperSidebar, PaperSidebarCollapseButton } from '@paper-ui/components/navigation';
import { Box } from '@paper-ui/components/layout';
import { FileText, Settings, Search, User, Star } from 'lucide-react';

const meta: Meta<typeof PaperSidebar> = {
  title: 'Components/Navigation/Sidebar',
  component: PaperSidebar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof PaperSidebar>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('docs');
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Box className="flex h-[500px] w-full max-w-[600px] bg-[#f6f5f1] border border-black/10">
        <PaperSidebar
          activeId={active}
          onNavigate={setActive}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          header={<div className="font-kalam font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis px-2">My App</div>}
          groups={[
            {
              id: 'main',
              label: 'Main Menu',
              items: [
                { id: 'search', label: 'Search', icon: <Search size={16} /> },
                { id: 'docs', label: 'Documents', icon: <FileText size={16} />, badge: 3 },
                { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
              ]
            }
          ]}
        />
        <div className="flex-1 p-6">
          <div className="flex items-center gap-4 mb-8">
            <PaperSidebarCollapseButton collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
            <span className="font-kalam text-ink-muted">^ External Toggle</span>
          </div>
        </div>
      </Box>
    );
  }
};

export const RichNavigation: Story = {
  render: () => {
    const [active, setActive] = useState('favorites');
    const [collapsed, setCollapsed] = useState(false);
    return (
      <Box className="flex h-[500px] w-full max-w-[800px] bg-white border border-black/10">
        <PaperSidebar
          activeId={active}
          onNavigate={setActive}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          header={<div className="font-architect font-bold text-xl px-2">SuperApp</div>}
          groups={[
            {
              id: 'personal',
              label: 'Personal',
              items: [
                { id: 'profile', label: 'Profile', icon: <User size={16} /> },
                { id: 'favorites', label: 'Favorites', icon: <Star size={16} />, badge: 12 },
              ]
            },
            {
              id: 'work',
              label: 'Workspace',
              items: [
                { id: 'docs', label: 'Documents', icon: <FileText size={16} /> },
                { id: 'settings', label: 'Preferences', icon: <Settings size={16} /> }
              ]
            }
          ]}
        />
        <div className="flex-1 p-8 bg-paper">
          Main content area with paper background.
        </div>
      </Box>
    );
  }
};
