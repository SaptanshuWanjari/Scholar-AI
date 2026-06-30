import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Workspace, Box, Surface, ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@paper-ui/components/layout';
import { PaperSidebar, TopBar } from '@paper-ui/components/navigation';
import { PaperH2, PaperSheetCard } from '@paper-ui/core';

const meta: Meta<typeof Workspace> = {
  title: 'Components/Layout/Workspace',
  component: Workspace,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Workspace>;

export const FullAppLayout: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => {
    const [active, setActive] = React.useState('dashboard');
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <div className="h-screen w-full relative bg-[#f6f5f1]">
        <Workspace>
          <PaperSidebar
            activeId={active}
            onNavigate={setActive}
            collapsed={collapsed}
            onCollapse={setCollapsed}
            header={<div className="font-kalam font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis px-2">Scholar AI</div>}
            groups={[
              {
                id: 'main',
                label: 'Overview',
                items: [
                  { id: 'dashboard', label: 'Dashboard', icon: <span className="w-4 h-4 bg-black/10 rounded-full inline-block" />, badge: 2 },
                  { id: 'documents', label: 'Documents', icon: <span className="w-4 h-4 bg-black/10 rounded-full inline-block" /> },
                ]
              }
            ]}
          />
          <Box className="flex-1 flex flex-col h-full overflow-hidden">
            <TopBar start={<div className="font-inter font-medium text-ink-muted">Dashboard</div>}>
              <button className="px-3 py-1.5 bg-white border border-black/10 rounded shadow-sm font-architect text-sm hover:bg-black/5 transition-colors">
                New
              </button>
            </TopBar>
            <Box className="flex-1 p-8 overflow-y-auto">
              <PaperH2 className="mb-6">Workspace Area</PaperH2>
              <PaperSheetCard className="min-h-[400px]">
                <div className="font-kalam text-lg text-ink-muted">Content goes here...</div>
              </PaperSheetCard>
            </Box>
          </Box>
        </Workspace>
      </div>
    );
  }
};

export const WithResizablePanels: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="h-screen w-full relative bg-paper">
      <Workspace>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} className="bg-sage-soft border-r border-black/10 p-4 font-kalam">
            Left Panel
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={60} className="p-8">
            <PaperH2>Main Editor</PaperH2>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={20} minSize={15} className="bg-sky-soft border-l border-black/10 p-4 font-kalam">
            Right Panel
          </ResizablePanel>
        </ResizablePanelGroup>
      </Workspace>
    </div>
  )
};
