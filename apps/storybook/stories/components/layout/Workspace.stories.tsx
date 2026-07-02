import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Workspace, Box } from '@paper-ui/components/layout';

const meta: Meta<typeof Workspace> = {
  title: 'Components/Layout/Workspace',
  component: Workspace,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Workspace>;

export const Default: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Workspace>
      <Box className="w-48 bg-sky-soft/20 border-r border-ink/20 p-4 overflow-y-auto">
        <div className="font-architect font-bold text-sm mb-4">Sidebar</div>
        <div className="space-y-2">
          {['Item 1', 'Item 2', 'Item 3'].map((item) => (
            <div key={item} className="font-kalam text-sm text-ink-muted p-2 hover:bg-ink/5 rounded">
              {item}
            </div>
          ))}
        </div>
      </Box>
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Box className="bg-white border-b border-ink/20 p-4 font-architecture font-bold text-sm">
          Main Content
        </Box>
        <Box className="flex-1 p-8 overflow-y-auto bg-[#f4f1ea]">
          <div className="max-w-3xl">
            <div className="font-architect text-2xl font-bold mb-4">Workspace Area</div>
            <p className="font-kalam text-ink-muted">Full-screen layout with sidebar and main content area.</p>
          </div>
        </Box>
      </Box>
    </Workspace>
  ),
};
