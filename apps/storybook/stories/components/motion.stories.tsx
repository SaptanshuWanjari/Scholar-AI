import React, { useState } from 'react';
import type { Meta } from '@storybook/react';
import {
  Fade as FadeComponent,
  Slide as SlideComponent,
  Scale as ScaleComponent,
  Collapse as CollapseComponent,
  HoverEffect as HoverEffectComponent,
  AnimatedCounter as AnimatedCounterComponent,
} from '@paper-ui/components/motion';
import { PaperCard, PaperPanel } from '@paper-ui/core';
import { PaperButton, SketchButton, StickyButton } from '@paper-ui/components/buttons';
import { PaperBadge } from '@paper-ui/components/badges';
import { StickyNoteCard } from '@paper-ui/components/cards';
import { Hand } from 'lucide-react';

const meta = {
  title: 'Components/Motion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `## Motion Primitives

Animation primitives for paper UI components. Built on CSS transitions with mount/unmount lifecycle support. Each primitive accepts directional parameters, delays, and standard transition easing.

### Components
- **Fade** — opacity transition with optional unmount
- **Slide** — directional slide-in/out animation
- **Scale** — scale transform with configurable initial scale
- **Collapse** — height-based collapse/expand
- **HoverEffect** — hover-triggered lift, glow, wiggle, and scale
- **AnimatedCounter** — animated number counter with duration and decimals`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Fade = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="p-8 space-y-4">
      <SketchButton onClick={() => setShow(!show)}>
        Toggle Fade
      </SketchButton>
      <div className="h-64">
        <FadeComponent in={show} unmountOnExit>
          <PaperCard shadow="lg" className="w-80 p-6">
            <h3 className="font-serif text-lg font-bold mb-2">Fading Paper</h3>
            <p className="font-mono text-sm text-gray-700">
              This card gently fades in and out. The paper texture remains crisp.
            </p>
          </PaperCard>
        </FadeComponent>
      </div>
    </div>
  );
};

export const Slide = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="p-8 space-y-4">
      <PaperButton tone="dark" onClick={() => setShow(!show)}>
        Toggle Slide
      </PaperButton>
      <div className="h-72 flex gap-6 items-start">
        <SlideComponent in={show} direction="up" unmountOnExit>
          <StickyNoteCard title="Sliding Up!" color="yellow" rotate={2} pin="push-pin">
            Sticky note content sliding from the bottom.
            <div className="mt-2">
              <PaperBadge tone="ink">Sticky</PaperBadge>
            </div>
          </StickyNoteCard>
        </SlideComponent>
        <SlideComponent in={show} direction="left" delay={150} unmountOnExit>
          <StickyNoteCard title="Sliding Left!" color="pink" rotate={-2} pin="tape">
            Another sticky note sliding from the right with a delay.
          </StickyNoteCard>
        </SlideComponent>
      </div>
    </div>
  );
};

export const Scale = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="p-8 space-y-4">
      <SketchButton onClick={() => setShow(!show)}>
        Toggle Scale
      </SketchButton>
      <div className="h-64 flex gap-8 items-center">
        <ScaleComponent in={show} unmountOnExit initialScale={0.5}>
          <PaperCard shadow="md" className="p-6 rounded-full flex flex-col items-center justify-center bg-white">
            <Hand size={48} className="text-indigo-500 mb-2" />
            <span className="font-serif font-bold text-lg">Popup Stamp</span>
          </PaperCard>
        </ScaleComponent>
      </div>
    </div>
  );
};

export const Collapse = () => {
  const [show, setShow] = useState(false);

  return (
    <div className="p-8 w-full max-w-md">
      <PaperCard shadow="md" className="p-4 overflow-hidden">
        <div className="flex flex-row items-center justify-between border-b-2 border-black border-dashed pb-2 mb-2">
          <h3 className="font-mono font-bold">Hidden Details</h3>
          <SketchButton size="sm" onClick={() => setShow(!show)}>
            {show ? 'Hide' : 'Reveal'}
          </SketchButton>
        </div>
        <CollapseComponent in={show}>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded mt-2">
            <p className="text-gray-700 italic font-serif">
              This text is revealed with a smooth collapse animation. 
              The layout adapts dynamically.
            </p>
            <div className="mt-4 flex gap-2">
              <PaperBadge tone="ink">Secret</PaperBadge>
              <PaperBadge tone="ink">Info</PaperBadge>
            </div>
          </div>
        </CollapseComponent>
      </PaperCard>
    </div>
  );
};

export const HoverEffects = () => {
  return (
    <div className="p-8 flex gap-8 flex-wrap items-start">
      <HoverEffectComponent lift glow>
        <PaperCard shadow="md" className="w-64 p-6 cursor-pointer">
          <h3 className="font-bold text-lg mb-2">Lift & Glow</h3>
          <p className="text-sm text-gray-600">
            Hover over me to see the card lift off the page with a soft glow.
          </p>
        </PaperCard>
      </HoverEffectComponent>

      <HoverEffectComponent wiggle scale={false}>
        <StickyNoteCard title="Wiggle!" color="green" rotate={1} pin="push-pin">
          Just a subtle wiggle on hover.
        </StickyNoteCard>
      </HoverEffectComponent>

      <HoverEffectComponent scale lift>
        <StickyButton tone="green" taped onClick={() => alert('Clicked!')}>
          Scale & Lift Button
        </StickyButton>
      </HoverEffectComponent>
    </div>
  );
};

export const AnimatedCounter = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex gap-4">
        <SketchButton onClick={() => setValue(100)}>Set 100</SketchButton>
        <SketchButton onClick={() => setValue(1250)}>Set 1,250</SketchButton>
        <SketchButton onClick={() => setValue(9999)}>Set 9,999</SketchButton>
        <PaperButton tone="dark" onClick={() => setValue(0)}>Reset</PaperButton>
      </div>
      
      <div className="flex gap-8 items-start">
        <AnimatedCounterComponent 
          title="Total"
          label="Score"
          value={value} 
        />
        
        <StickyNoteCard title="Percentage" color="blue" pin="tape" rotate={-2}>
          <div className="flex flex-col items-center">
            <AnimatedCounterComponent 
              value={Math.min(value / 100, 100)} 
              decimals={1}
              suffix="%"
              duration={2000}
              className="text-4xl font-bold font-mono text-blue-900"
            />
          </div>
        </StickyNoteCard>
      </div>
    </div>
  );
};
