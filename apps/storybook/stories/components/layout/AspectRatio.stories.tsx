import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AspectRatio } from '@paper-ui/components/layout';
import { CoffeeRing, Tape, PushPin, Scribble } from '@paper-ui/components/decorations';
import { SketchBorder, PaperH3 } from '@paper-ui/core';
import { Paper } from '@paper-ui/components/paper';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const AspectRatioVideo: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <div className="max-w-xl">
        <Paper className="p-4" shadow="md">
          <Tape corner="top-center" width={70} />
          <AspectRatio className="mt-2" ratio={16 / 9}>
            <div className="relative w-full h-full">
              <SketchBorder fill="#e8e4d9" stroke="#3a3733" strokeWidth={1.5} shadow={3} bleed={2} radius={0} />
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto border-4 border-ink/40 border-dashed rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[14px] border-t-[9px] border-b-[9px] border-l-ink/40 border-t-transparent border-b-transparent ml-1" />
                  </div>
                  <div className="font-kalam text-ink-muted mt-3 text-sm">your video here</div>
                </div>
              </div>
              <CoffeeRing position="bottom-right" size={80} opacity={0.12} rotate={-15} />
            </div>
          </AspectRatio>
          <div className="font-architect text-ink font-bold mt-3 text-lg">Lecture Recording</div>
          <div className="font-kalam text-ink-muted text-sm">Week 3 - Data Structures</div>
        </Paper>
      </div>
    </div>
  ),
};

export const AspectRatioSquare: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <div className="max-w-sm mx-auto">
        <div className="relative p-4 pb-12 bg-white rotate-2">
          <SketchBorder fill="#fff" stroke="#3a3733" strokeWidth={1.5} shadow={8} radius={2} bleed={3} />
          <Tape corner="top-center" width={90} className="rotate-2" />
          <AspectRatio ratio={1} className="mt-1">
            <div className="w-full h-full bg-gradient-to-br from-sky-soft/40 to-lavender-soft/40 flex items-center justify-center">
              <Scribble className="w-20 h-10 text-ink/20" />
              <div className="absolute font-kalam text-5xl text-ink/30 select-none">🌼</div>
            </div>
          </AspectRatio>
          <div className="text-center mt-3 font-kalam text-xl text-ink-muted">cherry blossoms</div>
          <div className="text-center font-kalam text-xs text-ink-muted/60">April 2024</div>
        </div>
      </div>
    </div>
  ),
};

export const AspectRatioMap: Story = {
  render: () => (
    <div className="p-12 bg-[#f4f1ea]">
      <div className="max-w-lg">
        <Paper className="p-5" shadow="md">
          <PushPin color="#b5685e" position="top-center" />
          <AspectRatio ratio={2 / 1} className="mt-1">
            <div className="relative w-full h-full">
              <SketchBorder fill="#f4f1ea" stroke="#3a3733" strokeWidth={1.2} shadow={2} bleed={1} radius={2} />
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full" style={{
                  backgroundImage: 'linear-gradient(#3a373315 1px, transparent 1px), linear-gradient(90deg, #3a373315 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}>
                  <div className="absolute top-1/2 left-1/3 font-kalam text-sm text-brick-soft bg-brick-soft/20 px-2 py-0.5 -translate-y-full">
                    You are here
                  </div>
                  <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-red rounded-full border-2 border-ink/40 -translate-x-1/2 -translate-y-1/2" style={{ backgroundColor: '#b5685e' }} />
                </div>
              </div>
            </div>
          </AspectRatio>
          <div className="font-kalam text-xs text-ink-muted/60 mt-2">Fig 1. Campus Map (not to scale)</div>
        </Paper>
      </div>
    </div>
  ),
};
