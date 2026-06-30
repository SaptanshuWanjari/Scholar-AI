import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, Box } from '@paper-ui/components/layout';
import { StickyNote, PaperStamp, PushPin } from '@paper-ui/components/decorations';
import { PaperCard } from '@paper-ui/core';

const meta: Meta<typeof Stack> = {
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const StickyNoteStack: Story = {
  render: () => (
    <Stack className="gap-6 p-8 w-80 items-center bg-black/5">
      <StickyNote color="yellow" className="rotate-2 w-full shadow-md">
        <PushPin className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
        <div className="font-kalam text-xl mt-2">1. Research paper UI</div>
      </StickyNote>
      <StickyNote color="blue" className="-rotate-1 w-full shadow-md">
        <PushPin className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
        <div className="font-kalam text-xl mt-2">2. Build components</div>
      </StickyNote>
      <StickyNote color="pink" className="rotate-1 w-full shadow-md">
        <PushPin className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
        <div className="font-kalam text-xl mt-2">3. Write stories</div>
      </StickyNote>
    </Stack>
  )
};

export const ApprovedDocuments: Story = {
  render: () => (
    <Stack className="gap-4 p-8 w-[400px]">
      <PaperCard className="relative p-6 w-full" shadow="md">
        <div className="font-architect font-bold text-lg">Document Alpha</div>
        <div className="font-inter text-sm text-ink-muted mt-2">A very important document.</div>
        <PaperStamp label="APPROVED" tone="sage" className="absolute top-2 right-2 rotate-12 z-10" />
      </PaperCard>
      <PaperCard className="relative p-6 w-full" shadow="sm" surface="#fcfaf8">
        <div className="font-architect font-bold text-lg">Document Beta</div>
        <div className="font-inter text-sm text-ink-muted mt-2">Needs revision.</div>
        <PaperStamp label="REJECTED" tone="brick" className="absolute top-2 right-2 -rotate-6 z-10 opacity-70" />
      </PaperCard>
    </Stack>
  )
};
