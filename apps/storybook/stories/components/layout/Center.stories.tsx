import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Center, Box } from '@paper-ui/components/layout';
import { PushPin, StickyNote, Tape } from '@paper-ui/components/decorations';
import { PaperCard, SketchBorder } from '@paper-ui/core';

const meta: Meta<typeof Center> = {
  title: 'Components/Layout/Center',
  component: Center,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Center>;

export const PinnedCenter: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <PaperCard className="relative min-h-[400px] p-8" shadow="md" surface="#fffdf9">
        <PushPin color="#b5685e" className="absolute -top-3 left-1/2 -translate-x-1/2 z-20" />
        <Center className="w-full h-full min-h-[300px]">
          <div className="relative bg-yellow-100 p-8 rotate-1" style={{ boxShadow: '2px 3px 0 rgba(0,0,0,0.12)' }}>
            <div className="font-kalam text-2xl text-ink-muted">centered content</div>
            <div
              className="absolute bottom-0 right-0 h-4 w-4"
              style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.06) 50%)' }}
            />
          </div>
        </Center>
      </PaperCard>
    </div>
  ),
};

export const CorkboardCenter: Story = {
  render: () => (
    <div className="p-12 bg-[#d2b48c]/30 min-h-[500px] relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #8b7355 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
      <Center className="w-full h-full min-h-[400px]">
        <StickyNote color="#fdf6b5" size={160} rotate={-1} pin="push-pin">
          <div className="font-kalam text-lg text-center px-2">
            Ideas go here!
          </div>
        </StickyNote>
      </Center>
    </div>
  ),
};

export const TapedCenter: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <Center className="min-h-[400px]">
        <div className="relative p-6 bg-white -rotate-1">
          <SketchBorder fill="#fff" stroke="#3a3733" strokeWidth={1.2} shadow={5} bleed={2} />
          <Tape corner="top-center" width={80} />
          <div className="relative z-[1]">
            <div className="font-architect text-3xl font-bold">HELLO WORLD</div>
            <div className="font-kalam text-lg text-ink-muted mt-2">Taped to the center</div>
          </div>
        </div>
      </Center>
    </div>
  ),
};
