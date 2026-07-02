import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@paper-ui/components/layout';

const meta = {
  title: 'Components/Layout/ResizablePanels',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] h-[400px]">
      <ResizablePanelGroup direction="horizontal" className="h-full border border-ink/20 rounded overflow-hidden">
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="h-full p-4 bg-white border-r border-ink/20 flex flex-col">
            <div className="font-architect font-bold text-sm mb-3">Left Panel</div>
            <p className="font-kalam text-xs text-ink-muted">Drag the handle to resize.</p>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full p-4 bg-sky-soft/10 flex flex-col">
            <div className="font-architect font-bold text-sm mb-3">Right Panel</div>
            <p className="font-kalam text-xs text-ink-muted">Main content area</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: StoryObj = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] h-[400px]">
      <ResizablePanelGroup direction="vertical" className="h-full border border-ink/20 rounded overflow-hidden">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full p-4 bg-white border-b border-ink/20 flex flex-col">
            <div className="font-architect font-bold text-sm">Top Panel</div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="h-full p-4 bg-sage-soft/10 flex flex-col">
            <div className="font-architect font-bold text-sm">Bottom Panel</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
