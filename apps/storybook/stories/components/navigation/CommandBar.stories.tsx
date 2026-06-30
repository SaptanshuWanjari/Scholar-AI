import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommandBar } from '@paper-ui/components/navigation';
import { Box } from '@paper-ui/components/layout';
import { Search, Settings, FileText } from 'lucide-react';

const meta: Meta<typeof CommandBar> = {
  title: 'Components/Navigation/CommandBar',
  component: CommandBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommandBar>;

export const Default: Story = {
  render: () => (
    <Box className="h-[400px] w-full max-w-lg border border-black/10 relative">
      <CommandBar open={true} onClose={() => {}} commands={[
        { key: '1', label: 'Search Documents', icon: <Search size={16} />, action: () => {} },
        { key: '2', label: 'Settings', icon: <Settings size={16} />, action: () => {} }
      ]} />
    </Box>
  )
};

export const RichCommands: Story = {
  render: () => (
    <Box className="h-[400px] w-full max-w-lg border border-black/10 relative bg-paper">
      <CommandBar open={true} onClose={() => {}} commands={[
        { key: '1', label: 'Create Note', icon: <FileText size={16} />, action: () => {} },
        { key: '2', label: 'Find in Page', icon: <Search size={16} />, action: () => {} },
        { key: '3', label: 'Preferences', icon: <Settings size={16} />, action: () => {} }
      ]} />
    </Box>
  )
};
