import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@paper-ui/components/layout';
import { Paper } from '@paper-ui/components/paper';
import { Tape, TapeLabel, NotebookSpiral, SketchDivider } from '@paper-ui/components/decorations';
import { PaperCard, PaperH2, PaperH3 } from '@paper-ui/core';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

const HANDWRITTEN_LINES = Array.from({ length: 30 }, (_, i) => (
  <div key={i} className="font-kalam text-lg text-ink-muted leading-relaxed py-1 border-b border-dashed border-ink/10">
    This is line {i + 1} of my handwritten notebook. The quick brown fox jumps over the lazy dog.
  </div>
));

export const NotebookScroll: Story = {
  render: () => (
    <div className="p-12 bg-[#e8e4d9]">
      <div className="max-w-lg mx-auto">
        <Paper className="relative p-6 pt-8" shadow="md">
          <NotebookSpiral count={10} />
          <div className="font-architect text-2xl font-bold text-ink mb-4">Journal</div>
          <Tape corner="top-right" width={60} />
          <ScrollArea maxHeight={400} className="pr-2">
            <div className="font-kalam">
              <p className="text-lg text-ink-muted mb-4">
                Dear diary, today I discovered the most wonderful thing about digital scrapbooking — you can actually make things look like real paper!
              </p>
              <SketchDivider variant="wavy" />
              <p className="text-lg text-ink-muted my-4">
                The scroll area feels like flipping through pages of an old notebook. Each line has its own character, just like real handwriting.
              </p>
              <SketchDivider variant="wavy" />
              {HANDWRITTEN_LINES.slice(0, 15)}
            </div>
          </ScrollArea>
        </Paper>
      </div>
    </div>
  ),
};

export const DoodleJournal: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <div className="max-w-md mx-auto">
        <PaperCard className="relative p-6" shadow="md" surface="#fffdf9">
          <TapeLabel color="ochre" className="absolute -top-1 right-8 rotate-3">Journal</TapeLabel>
          <PaperH2>Quick Notes</PaperH2>
          <ScrollArea maxHeight={350} className="mt-4 pr-1">
            <div className="space-y-4">
              {[
                { date: 'Mon', text: 'Reviewed chapter 4. Key insight: recursion is just a function calling itself with a smaller problem.', color: 'bg-yellow-50' },
                { date: 'Tue', text: 'Met with study group. We built a linked list from scratch. Everyone brought snacks.', color: 'bg-sky-50' },
                { date: 'Wed', text: 'Office hours were helpful. Professor explained tree traversal with a whiteboard full of arrows.', color: 'bg-ochre-50' },
                { date: 'Thu', text: 'Practice problems 1-20 completed. Still struggling with dynamic programming.', color: 'bg-lavender-50' },
                { date: 'Fri', text: 'Weekend! Time to review everything before the quiz on Monday. Wish me luck.', color: 'bg-sage-50' },
                { date: 'Sat', text: 'Created flashcards. Reviewing key terms: O(n), binary search, merge sort.', color: 'bg-pink-50' },
              ].map((entry, i) => (
                <div key={i} className={`${entry.color} p-3 border border-ink/10 rotate-[${i % 2 === 0 ? '-' : ''}${i % 2 === 0 ? 0.5 : 0.8}deg]`} style={{ boxShadow: '1px 2px 0 rgba(0,0,0,0.08)' }}>
                  <div className="font-architect text-xs font-bold text-ink/50 uppercase">{entry.date}</div>
                  <div className="font-kalam text-ink-muted mt-1 leading-relaxed">{entry.text}</div>
                  <Tape corner={i % 2 === 0 ? 'top-right' : 'top-left'} width={40} color="rgba(180,150,120,0.3)" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </PaperCard>
      </div>
    </div>
  ),
};
