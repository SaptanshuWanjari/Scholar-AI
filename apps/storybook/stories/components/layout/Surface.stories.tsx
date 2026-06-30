import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface, Box } from '@paper-ui/components/layout';
import { MarkerHighlight, PaperClip, Tape } from '@paper-ui/components/decorations';
import { PaperH2, SketchBorder } from '@paper-ui/core';

const meta: Meta<typeof Surface> = {
  title: 'Components/Layout/Surface',
  component: Surface,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Surface>;

export const HighlightedCard: Story = {
  render: () => (
    <Surface className="p-8 max-w-md relative bg-paper shadow-lg">
      <div className="absolute -top-5 right-6 z-10 rotate-12">
        <PaperClip />
      </div>
      <PaperH2>Study Guide</PaperH2>
      <div className="mt-6 space-y-4 font-inter text-ink/90">
        <p>
          Make sure you review the <MarkerHighlight color="yellow">core concepts</MarkerHighlight> before the exam.
        </p>
        <p>
          Don't forget to practice <MarkerHighlight color="pink">algorithms</MarkerHighlight>!
        </p>
      </div>
    </Surface>
  )
};

export const TapedNotice: Story = {
  render: () => (
    <Surface className="p-8 max-w-md relative bg-ochre-soft border-0 mt-8">
      <SketchBorder fill="var(--color-ochre-soft)" stroke="none" shadow={6} />
      <Tape corner="top-center" width={120} className="rotate-1" />
      <div className="relative z-[1] text-center">
        <h3 className="font-architect text-3xl font-bold mb-4">NOTICE</h3>
        <p className="font-kalam text-lg text-ink-muted">The office will be closed on Friday.</p>
      </div>
    </Surface>
  )
};
