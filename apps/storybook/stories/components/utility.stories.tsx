import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Divider,
  Separator,
  Avatar,
  AvatarGroup,
  IconWrapper,
  KeyboardHint,
  PageTitle,
} from '@paper-ui/components/utility';
import { SketchButton } from '@paper-ui/components/buttons';
import { Brain, BookOpen, Star, Zap, Search } from 'lucide-react';

const meta = {
  title: 'Components/Utility',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const DividerExample = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">Divider — variants</h2>

    <div className="max-w-md space-y-8">
      {(['wavy', 'straight', 'dashed', 'line'] as const).map(variant => (
        <div key={variant}>
          <p className="font-mono text-xs text-gray-500 mb-2">{variant}</p>
          <Divider variant={variant} />
        </div>
      ))}

      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">wavy with label</p>
        <Divider variant="wavy" label="or continue with" />
      </div>

      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">dashed with label</p>
        <Divider variant="dashed" label="Section Break" />
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">Vertical dividers</h3>
      <div className="flex items-center gap-2 h-8">
        <span className="font-architect text-sm">File</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm">Edit</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm">View</span>
        <Divider orientation="vertical" />
        <span className="font-architect text-sm">Help</span>
      </div>
    </div>
  </div>
);

export const SeparatorExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">Separator — CSS-only thin rule</h2>
    <div className="max-w-xs space-y-4 bg-white/60 rounded-xl p-4">
      <p className="font-kalam text-sm">Item one</p>
      <Separator />
      <p className="font-kalam text-sm">Item two</p>
      <Separator />
      <p className="font-kalam text-sm">Item three</p>
    </div>
    <div className="flex items-center gap-1 mt-4">
      <span className="font-architect text-sm">Cut</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="font-architect text-sm">Copy</span>
      <Separator orientation="vertical" className="h-4" />
      <span className="font-architect text-sm">Paste</span>
    </div>
  </div>
);

export const AvatarExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">Avatar — sizes & tones</h2>
    <div className="flex flex-wrap gap-4 items-end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar name="Ada Lovelace" size={size} tone="sage" />
          <span className="font-mono text-xs text-gray-500">{size}</span>
        </div>
      ))}
    </div>

    <h3 className="font-serif text-base font-bold mt-4">All tones</h3>
    <div className="flex flex-wrap gap-4">
      {(['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as const).map(tone => (
        <div key={tone} className="flex flex-col items-center gap-1">
          <Avatar name={tone} tone={tone} size="md" />
          <span className="font-mono text-[10px] text-gray-500">{tone}</span>
        </div>
      ))}
    </div>

    <h3 className="font-serif text-base font-bold mt-4">AvatarGroup — overlapping stack</h3>
    <AvatarGroup
      max={4}
      avatars={[
        { name: 'Ada Lovelace', tone: 'sage' },
        { name: 'Grace Hopper', tone: 'sky' },
        { name: 'Alan Turing', tone: 'ochre' },
        { name: 'Tim Berners-Lee', tone: 'lavender' },
        { name: 'Linus Torvalds', tone: 'brick' },
        { name: 'John McCarthy', tone: 'ink' },
      ]}
    />
  </div>
);

export const IconWrapperExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">IconWrapper — shapes & tones</h2>

    <h3 className="font-serif text-base font-bold">Circle (default)</h3>
    <div className="flex flex-wrap gap-4">
      {(['sage', 'ochre', 'sky', 'lavender', 'brick', 'ink'] as const).map(tone => (
        <div key={tone} className="flex flex-col items-center gap-1">
          <IconWrapper tone={tone} shape="circle" size={40}><Brain size={18} /></IconWrapper>
          <span className="font-mono text-[10px] text-gray-500">{tone}</span>
        </div>
      ))}
    </div>

    <h3 className="font-serif text-base font-bold mt-4">Square</h3>
    <div className="flex flex-wrap gap-4">
      {(['sage', 'sky', 'lavender'] as const).map(tone => (
        <IconWrapper key={tone} tone={tone} shape="square" size={44}><BookOpen size={20} /></IconWrapper>
      ))}
    </div>

    <h3 className="font-serif text-base font-bold mt-4">No container (none)</h3>
    <div className="flex flex-wrap gap-4">
      {(['sage', 'ochre', 'brick'] as const).map(tone => (
        <IconWrapper key={tone} tone={tone} shape="none"><Star size={24} /></IconWrapper>
      ))}
    </div>

    <h3 className="font-serif text-base font-bold mt-4">Sizes</h3>
    <div className="flex gap-4 items-end">
      {[24, 32, 40, 52, 64].map(size => (
        <IconWrapper key={size} tone="sage" size={size}><Zap size={size * 0.45} /></IconWrapper>
      ))}
    </div>
  </div>
);

export const KeyboardHintExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">KeyboardHint</h2>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <KeyboardHint keys={['⌘', 'K']} label="to open command bar" />
      </div>
      <div className="flex items-center gap-3">
        <KeyboardHint keys={['Ctrl', 'Shift', 'P']} label="to open palette" />
      </div>
      <div className="flex items-center gap-3">
        <KeyboardHint keys={['Esc']} label="to dismiss" />
      </div>
      <div className="flex items-center gap-3">
        <KeyboardHint keys={['⌘', 'Z']} label="undo" />
      </div>
      <div className="flex items-center gap-3">
        <KeyboardHint keys={['⌘', 'Shift', 'Z']} label="redo" />
      </div>

      <div className="mt-6 bg-white/60 rounded-xl p-4 max-w-sm">
        <p className="font-architect text-sm text-ink-muted">
          Press <KeyboardHint keys={['⌘', 'K']} /> to search, or{' '}
          <KeyboardHint keys={['Esc']} /> to dismiss.
        </p>
      </div>
    </div>
  </div>
);

export const PageTitleExample = () => (
  <div className="p-10 space-y-12 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PageTitle</h2>

    <div className="max-w-2xl space-y-10">
      <PageTitle title="Documents" />

      <PageTitle
        title="Machine Learning"
        eyebrow="Course"
        subtitle="24 documents · 138 concepts · 12h studied"
        action={<SketchButton size="sm"><Search size={14} /> Search</SketchButton>}
      />

      <PageTitle
        title="Backpropagation"
        eyebrow="Concept"
        subtitle="Neural network training algorithm"
        breadcrumbs={[
          { label: 'Courses', href: '#' },
          { label: 'Machine Learning', href: '#' },
          { label: 'Backpropagation' },
        ]}
        marker
        markerColor="#fde047"
        action={<SketchButton size="sm">Study Now</SketchButton>}
      />
    </div>
  </div>
);
