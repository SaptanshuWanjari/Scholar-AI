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
    <Flex className="gap-8 p-12 bg-[#f4f1ea] flex-wrap">
      <TapeLabel color="brick" className="-rotate-2">Important</TapeLabel>
      <TapeLabel color="sky" className="rotate-3">To Review</TapeLabel>
      <TapeLabel color="ochre" className="-rotate-1">Archived</TapeLabel>
      <TapeLabel color="sage" className="rotate-2">Personal</TapeLabel>
    </Flex>
  ),
};

export const PinBoardRow: Story = {
  render: () => (
    <Flex className="gap-8 p-12 items-start flex-wrap bg-[#c8a882]/20">
      {[
        { label: 'Research', rotation: '-rotate-2', pinColor: '#b5685e' },
        { label: 'Design', rotation: 'rotate-1', pinColor: '#5e8ab5' },
        { label: 'Build', rotation: '-rotate-1', pinColor: '#c9954f' },
      ].map(({ label, rotation, pinColor }) => (
        <PaperCard
          key={label}
          className={`w-32 h-32 flex items-center justify-center ${rotation}`}
          surface="#fff"
          shadow="md"
          border={{ stroke: '#3a3733', strokeWidth: 1, bleed: 2 }}
          texture={false}
        >
          <PushPin color={pinColor} position="top-center" />
          <div className="font-kalam text-xl text-ink-muted">{label}</div>
        </PaperCard>
      ))}
    </Flex>
  ),
};
