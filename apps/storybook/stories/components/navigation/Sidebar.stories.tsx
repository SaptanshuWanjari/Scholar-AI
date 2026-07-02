import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar, SidebarHeader, SidebarGroup, SidebarItem, SidebarDivider } from '@paper-ui/components/navigation';
import { FileText, Settings, Search, Star } from 'lucide-react';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Navigation/Sidebar',
  component: Sidebar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState('docs');
    return (
      <div className="p-8 bg-[#f4f1ea] inline-block">
        <Sidebar className="h-[400px]">
          <SidebarHeader title="StudyHub" subtitle="Your learning space" />
          <SidebarGroup label="Main">
            <SidebarItem
              icon={Search}
              label="Search"
              active={active === 'search'}
              onClick={() => setActive('search')}
            />
            <SidebarItem
              icon={FileText}
              label="Documents"
              active={active === 'docs'}
              onClick={() => setActive('docs')}
            />
            <SidebarItem
              icon={Star}
              label="Bookmarks"
              active={active === 'bookmark'}
              onClick={() => setActive('bookmark')}
            />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Settings">
            <SidebarItem
              icon={Settings}
              label="Preferences"
              active={active === 'settings'}
              onClick={() => setActive('settings')}
            />
          </SidebarGroup>
        </Sidebar>
      </div>
    );
  },
};
