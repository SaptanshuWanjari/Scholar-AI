import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  AnnotationBubble,
  StickyAnchor,
  MarginNote,
  HighlightLabel,
  PageMarker,
  BookmarkMarker,
  SelectionToolbar,
  ReadingProgress,
} from '@paper-ui/components/pdf';
import { Highlighter, MessageSquare, Bookmark, Copy, Share2, Star } from 'lucide-react';

const meta = {
  title: 'Components/PDF',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const AnnotationBubbleExample = () => (
  <div className="p-10 space-y-16 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">AnnotationBubble — tail positions</h2>
    <div className="flex flex-wrap gap-16 pt-4">
      {(['bottom-left', 'bottom-right', 'top-left', 'top-right'] as const).map(tail => (
        <div key={tail} className="relative pt-10 pb-10">
          <AnnotationBubble tail={tail} maxWidth={200}>
            <p className="font-kalam text-sm">This is an annotation bubble with a {tail} tail.</p>
          </AnnotationBubble>
          <p className="font-mono text-xs text-gray-500 mt-2 text-center">{tail}</p>
        </div>
      ))}
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-4">Custom colors</h3>
      <div className="flex gap-8 pt-4">
        <AnnotationBubble color="#fff9c4" tail="bottom-left">
          <p className="font-kalam text-sm">Yellow annotation note</p>
        </AnnotationBubble>
        <AnnotationBubble color="#e8f4f8" tail="bottom-right">
          <p className="font-kalam text-sm">Blue annotation note</p>
        </AnnotationBubble>
      </div>
    </div>
  </div>
);

export const HighlightLabelExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">HighlightLabel — inline term chips</h2>
    <p className="font-kalam text-lg leading-relaxed max-w-lg">
      The <HighlightLabel>attention mechanism</HighlightLabel> allows the model to focus on
      relevant parts of the sequence. Combined with <HighlightLabel color="#c8e6c9">positional encoding</HighlightLabel>{' '}
      and <HighlightLabel color="#f0d3d3">multi-head attention</HighlightLabel>, it forms
      the core of the <HighlightLabel color="#d3e0f0">Transformer</HighlightLabel> architecture.
    </p>
  </div>
);

export const MarginNoteExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">MarginNote</h2>
    <div className="flex gap-8 max-w-2xl">
      <MarginNote side="left" label="Note">
        <p className="font-kalam text-xs text-ink-muted">
          Self-attention is O(n²) complexity — may be slow for very long sequences.
        </p>
      </MarginNote>

      <div className="flex-1 font-kalam text-base leading-relaxed">
        <p>
          The Transformer model relies entirely on attention mechanisms, dispensing with recurrence and convolutions entirely.
          Self-attention, sometimes called intra-attention, is an attention mechanism relating different positions of a single
          sequence to compute a representation of the sequence.
        </p>
      </div>

      <MarginNote side="right" label="Key">
        <p className="font-kalam text-xs text-ink-muted">
          Q, K, V = Query, Key, Value matrices derived from input embeddings.
        </p>
      </MarginNote>
    </div>
  </div>
);

export const BookmarkMarkerExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">BookmarkMarker — page corner bookmarks</h2>
    <div className="flex gap-8">
      {[
        { color: '#c8e6c9', label: 'Ch.1' },
        { color: '#fff9c4', label: 'Ch.2' },
        { color: '#fce4e4', label: 'Ch.3' },
        { color: '#ddeeff', label: 'Ch.4' },
      ].map(({ color, label }) => (
        <div key={label} className="relative bg-white w-32 h-48 rounded shadow-sm overflow-hidden">
          <BookmarkMarker color={color} label={label} offset={12} height={56} />
          <div className="p-4 pt-14">
            <p className="font-kalam text-xs text-gray-600">Page content here</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PageMarkerExample = () => {
  const [active, setActive] = useState<string[]>(['top-right']);
  const corners = ['top-right', 'bottom-right', 'top-left', 'bottom-left'] as const;
  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PageMarker — fold-corner markers</h2>
      <div className="relative bg-white w-64 h-80 rounded shadow-sm mx-auto">
        <div className="p-6 pt-8 font-kalam text-sm text-ink-muted leading-relaxed">
          Click a corner to toggle the page marker.
        </div>
        {corners.map(corner => (
          <PageMarker
            key={corner}
            corner={corner}
            size={32}
            active={active.includes(corner)}
            color="#f6e27a"
            onToggle={() =>
              setActive(s => s.includes(corner) ? s.filter(c => c !== corner) : [...s, corner])
            }
          />
        ))}
      </div>
    </div>
  );
};

export const SelectionToolbarExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SelectionToolbar — text selection popup</h2>
    <div className="flex flex-wrap gap-8">
      <div className="relative bg-white rounded-xl p-8 shadow-sm w-72">
        <p className="font-kalam text-sm text-ink-muted leading-relaxed">
          Select some text to see the toolbar appear above it.
        </p>
        <div className="mt-4 relative">
          <SelectionToolbar
            floating={false}
            actions={[
              { icon: <Highlighter size={14} />, label: 'Highlight', onClick: () => {} },
              { icon: <MessageSquare size={14} />, label: 'Annotate', onClick: () => {} },
              { icon: <Copy size={14} />, label: 'Copy', onClick: () => {} },
              { icon: <Star size={14} />, label: 'Bookmark', onClick: () => {} },
              { icon: <Share2 size={14} />, label: 'Share', onClick: () => {} },
            ]}
          />
        </div>
      </div>
    </div>
  </div>
);

export const StickyAnchorExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StickyAnchor — sticky note attached to text</h2>
    <div className="flex flex-col gap-6 max-w-md">
      <div className="flex items-start gap-2">
        <p className="font-kalam text-base leading-relaxed flex-1">
          The attention mechanism computes a weighted sum of values.
        </p>
        <StickyAnchor color="#fff9c4" side="right">
          <p className="font-kalam text-xs">Review this!</p>
        </StickyAnchor>
      </div>

      <div className="flex items-start gap-2">
        <StickyAnchor color="#c8e6c9" side="left">
          <p className="font-kalam text-xs">Key concept</p>
        </StickyAnchor>
        <p className="font-kalam text-base leading-relaxed flex-1">
          Positional encoding allows the model to use the order of the sequence.
        </p>
      </div>
    </div>
  </div>
);

export const ReadingProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ReadingProgress</h2>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">Horizontal</h3>
      <div className="max-w-md space-y-4">
        {[0, 25, 60, 100].map(v => (
          <div key={v} className="space-y-1">
            <ReadingProgress value={v} orientation="horizontal" label />
            <span className="font-mono text-xs text-gray-500">{v}%</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">Vertical — sidebar reading progress</h3>
      <div className="flex gap-8 items-end">
        {[10, 40, 75, 100].map(v => (
          <div key={v} className="flex flex-col items-center gap-2" style={{ height: 160 }}>
            <ReadingProgress value={v} orientation="vertical" height={120} label />
            <span className="font-mono text-xs text-gray-500">{v}%</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">Custom colors</h3>
      <div className="max-w-md space-y-3">
        <ReadingProgress value={45} color="#4a6f91" />
        <ReadingProgress value={72} color="#b07a2e" />
        <ReadingProgress value={91} color="#6f63a3" />
      </div>
    </div>
  </div>
);
