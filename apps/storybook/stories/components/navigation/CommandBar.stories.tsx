import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommandBar } from '@paper-ui/components/navigation';
import { Search, Settings, FileText, BookOpen, Zap } from 'lucide-react';

const meta: Meta<typeof CommandBar> = {
  title: 'Components/Navigation/CommandBar',
  component: CommandBar,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof CommandBar>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] min-h-screen">
      <CommandBar
        open={true}
        onClose={() => {}}
        commands={[
          {
            key: '1',
            label: 'Search Documents',
            description: 'Find any document by name or content',
            icon: <Search size={16} />,
            shortcut: ['Cmd', 'K'],
            action: () => {}
          },
          {
            key: '2',
            label: 'Create Note',
            description: 'Start a new study note',
            icon: <FileText size={16} />,
            shortcut: ['Cmd', 'N'],
            action: () => {}
          },
          {
            key: '3',
            label: 'Settings',
            description: 'Open app preferences',
            icon: <Settings size={16} />,
            shortcut: ['Cmd', ','],
            action: () => {}
          },
          {
            key: '4',
            label: 'Recent Courses',
            description: 'Jump to a course',
            icon: <BookOpen size={16} />,
            action: () => {}
          },
          {
            key: '5',
            label: 'Quick Quiz',
            description: 'Generate quiz from selected text',
            icon: <Zap size={16} />,
            action: () => {}
          }
        ]}
      />
    </div>
  ),
};
