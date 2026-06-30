import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section, Container, Box } from '@paper-ui/components/layout';
import { PaperH2, PaperH3 } from '@paper-ui/core';
import { PaperTexture } from '@paper-ui/components/paper';

const meta: Meta<typeof Section> = {
  title: 'Components/Layout/Section',
  component: Section,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  render: () => (
    <Section className="bg-paper border-y border-black/10 relative overflow-hidden">
      <PaperTexture opacity={0.3} />
      <Container className="relative z-10">
        <PaperH2>Section Heading</PaperH2>
        <p className="mt-4 font-inter text-ink text-lg">
          Semantic section with py-12/16/20 padding.
        </p>
      </Container>
    </Section>
  )
};

export const Colored: Story = {
  render: () => (
    <Section className="bg-ochre-soft">
      <Container>
        <PaperH3>Colored Section</PaperH3>
        <p className="mt-4 font-kalam text-ink">Great for alternating page layouts.</p>
      </Container>
    </Section>
  )
};
