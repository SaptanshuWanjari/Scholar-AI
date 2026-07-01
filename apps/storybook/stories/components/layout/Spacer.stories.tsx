import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex, Spacer } from '@paper-ui/components/layout';
import { Paper } from '@paper-ui/components/paper';
import { PushPin, Tape } from '@paper-ui/components/decorations';
import { PaperCard, PaperH3, PaperIconCircle } from '@paper-ui/core';
import { User, Settings, Bell } from 'lucide-react';

const meta: Meta<typeof Spacer> = {
  title: 'Components/Layout/Spacer',
  component: Spacer,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Spacer>;

export const ToolbarSpacer: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <PaperCard className="w-full max-w-2xl" shadow="md" surface="#fffdf9">
        <Flex className="items-center px-6 py-3">
          <div className="font-architect font-bold text-lg text-ink">My Notes</div>
          <Spacer />
          <Flex className="gap-2">
            <PaperIconCircle tone="sage" size={32}>
              <User size={16} />
            </PaperIconCircle>
            <PaperIconCircle tone="sky" size={32}>
              <Settings size={16} />
            </PaperIconCircle>
            <PaperIconCircle tone="ochre" size={32}>
              <Bell size={16} />
            </PaperIconCircle>
          </Flex>
        </Flex>
      </PaperCard>
    </div>
  ),
};

export const PaperHeader: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <Paper className="w-full max-w-xl" shadow="md">
        <Flex className="items-center px-6 py-4 border-b border-ink/10">
          <PushPin color="#b5685e" size={20} position="none" />
          <PaperH3 className="ml-2">Chapter Summary</PaperH3>
          <Spacer />
          <Flex className="gap-2 font-kalam text-sm">
            <div className="px-3 py-1 bg-sage-soft border border-ink/20 rounded-sm cursor-pointer hover:bg-sage-soft/70 transition-colors">Edit</div>
            <div className="px-3 py-1 bg-brick-soft border border-ink/20 rounded-sm cursor-pointer hover:bg-brick-soft/70 transition-colors">Close</div>
          </Flex>
        </Flex>
        <div className="p-6 font-kalam text-ink-muted">
          <p>This is the content area below the header. The spacer pushes the action buttons to the right edge of the card.</p>
        </div>
      </Paper>
    </div>
  ),
};

export const ContactRow: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <PaperCard className="w-full max-w-lg" shadow="sm" surface="#fcfaf8">
        <Flex className="items-center px-5 py-3 font-kalam text-ink-muted">
          <span>home</span>
          <Spacer />
          <span>/</span>
          <Spacer />
          <span>documents</span>
          <Spacer />
          <span>/</span>
          <Spacer />
          <span className="text-ink font-bold">projects</span>
        </Flex>
      </PaperCard>
    </div>
  ),
};
