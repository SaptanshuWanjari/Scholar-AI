import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Container } from '@paper-ui/components/layout';
import { PaperH2, PaperH3 } from '@paper-ui/core';
import { CoffeeRing, Scribble, Tape, NotebookSpiral } from '@paper-ui/components/decorations';

const meta: Meta<typeof Section> = {
  title: 'Components/Wrappers/Section',
  component: Section,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section className="bg-paper border-y border-black/10 relative overflow-hidden">
      <CoffeeRing className="absolute -bottom-12 -right-12 text-amber-900/10 w-40 h-40" />
      <Scribble className="absolute top-6 right-10 text-ink/10 w-24 h-24 rotate-12" />
      <Container className="relative z-10">
        <PaperH2>Section Heading</PaperH2>
        <p className="mt-4 font-inter text-ink text-lg max-w-xl">
          Semantic section with py-12/16/20 padding. The coffee ring and scribble add a studied-notebook feel.
        </p>
      </Container>
    </Section>
  ),
};

export const Colored: Story = {
  render: () => (
    <Section className="bg-ochre-soft">
      <Tape corner="top-left" width={80} />
      <Tape corner="bottom-right" width={60} className="rotate-6" />
      <Container>
        <PaperH3>Colored Section</PaperH3>
        <p className="mt-4 font-kalam text-ink">Great for alternating page layouts. Taped corners give it a scrapbook feel.</p>
      </Container>
    </Section>
  ),
};

export const NotebookSection: Story = {
  render: () => (
    <Section className="bg-[#faf8f4]">
      <NotebookSpiral className="absolute left-4 top-0 bottom-0" />
      <Container className="pl-10">
        <PaperH2>Notebook Layout</PaperH2>
        <p className="mt-4 font-kalam text-ink-muted max-w-lg">
          A section styled like a notebook page, with spiral binding on the left edge and a handwritten heading.
        </p>
        <div className="mt-6 flex gap-4">
          <div className="w-24 h-0.5 bg-ink/20" />
          <div className="w-24 h-0.5 bg-ink/20" />
          <div className="w-24 h-0.5 bg-ink/20" />
        </div>
        <p className="mt-4 font-kalam text-ink/60 text-sm">— notes from the margin</p>
      </Container>
    </Section>
  ),
};
