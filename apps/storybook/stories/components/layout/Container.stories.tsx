import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container, Box } from '@paper-ui/components/layout';
import { CoffeeRing, SketchDivider } from '@paper-ui/components/decorations';
import { PaperH1 } from '@paper-ui/core';
import { NotebookSpiralCard } from '@paper-ui/components/cards';

const meta: Meta<typeof Container> = {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Container>;

export const NotebookPage: Story = {
  render: () => (
    <div className="w-full bg-[#e8e4d9] py-12 px-4 relative overflow-hidden">
      <Container className="max-w-2xl">
        <NotebookSpiralCard title="Journal Entry" className="min-h-[600px]">
          <div className="space-y-8 font-kalam text-lg leading-relaxed text-ink/80 mt-6">
            <p>Today I discovered how powerful these handcrafted components can be.</p>
            <SketchDivider variant="wavy" />
            <p>You can mix and match tape, pins, stamps, and coffee rings to create beautiful layouts.</p>
            <SketchDivider variant="wavy" />
            <p>It's like having a digital scrapbook!</p>
          </div>
        </NotebookSpiralCard>
      </Container>
    </div>
  )
};
