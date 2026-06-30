import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from '@paper-ui/components/layout';
import { Tape, PushPin, CoffeeRing, StickyNote, FoldedCorner, PaperClip } from '@paper-ui/components/decorations';
import { SketchBorder, PaperH3 } from '@paper-ui/core';

const meta: Meta<typeof Box> = {
  title: 'Components/Layout/Box',
  component: Box,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Box>;

export const PolaroidPicture: Story = {
  render: () => (
    <Box className="relative w-64 p-4 pb-12 bg-white rotate-2 transition-transform hover:rotate-0">
      <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.5} shadow={10} radius={0} bleed={2} />
      <Tape corner="top-center" className="w-24 text-black/20" />
      <div className="relative z-[1]">
        <div className="aspect-square bg-black/10 mb-4 overflow-hidden relative">
          <SketchBorder fill="#e4e0d6" stroke="#3a3733" strokeWidth={1} radius={0} bleed={2} />
          <CoffeeRing className="absolute -bottom-10 -right-10 text-amber-900/10 w-32 h-32" />
        </div>
        <div className="font-kalam text-xl text-center text-ink-muted">Summer '24</div>
      </div>
    </Box>
  )
};

export const CorkboardItem: Story = {
  render: () => (
    <Box className="relative p-6 w-72 bg-sky-soft -rotate-1">
      <SketchBorder fill="var(--color-sky-soft)" stroke="#3a3733" strokeWidth={1.5} shadow={5} bleed={3} />
      <PushPin color="var(--color-red)" className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
      <div className="relative z-[1] font-architect text-ink">
        <PaperH3>Meeting Notes</PaperH3>
        <p className="mt-4">Discuss the new handcrafted UI components and evaluate the sketchy aesthetics.</p>
      </div>
    </Box>
  )
};

export const AttachedDocument: Story = {
  render: () => (
    <Box className="relative p-8 w-80 bg-paper rotate-1">
      <SketchBorder fill="#fffdf9" stroke="#3a3733" strokeWidth={1.2} shadow={8} />
      <PaperClip className="absolute -top-5 -left-3 z-10 -rotate-12" />
      <div className="relative z-[1]">
        <PaperH3>Invoice #001</PaperH3>
        <div className="font-kalam mt-4 text-ink-muted">Amount due: $450.00</div>
        <div className="font-kalam text-ink-muted">Please pay by Friday!</div>
      </div>
    </Box>
  )
};
