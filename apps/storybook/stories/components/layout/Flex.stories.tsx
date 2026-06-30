import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Flex } from '@paper-ui/components/layout';
import { TapeLabel, PushPin } from '@paper-ui/components/decorations';
import { PaperCard } from '@paper-ui/core';

const meta: Meta<typeof Flex> = {
  title: 'Components/Layout/Flex',
  component: Flex,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Flex>;

export const TapeTags: Story = {
  render: () => (
    <Flex className="gap-8 p-12 bg-black/5 flex-wrap">
      <TapeLabel color="brick" className="-rotate-2">Important</TapeLabel>
      <TapeLabel color="sky" className="rotate-3">To Review</TapeLabel>
      <TapeLabel color="ochre" className="-rotate-1">Archived</TapeLabel>
      <TapeLabel color="sage" className="rotate-2">Personal</TapeLabel>
    </Flex>
  )
};

export const PinBoardRow: Story = {
  render: () => (
    <Flex className="gap-12 p-8 items-center bg-[#d2b48c]/20">
      {[1, 2, 3].map(i => (
        <PaperCard key={i} className="w-32 h-32 flex items-center justify-center" surface="#fff" shadow="md" border={{ stroke: "#3a3733", strokeWidth: 1, bleed: 2 }} texture={false}>
          <PushPin color={['red', 'blue', 'yellow'][i-1] as any} className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
          <div className="font-kalam text-2xl text-ink-muted">Item {i}</div>
        </PaperCard>
      ))}
    </Flex>
  )
};
