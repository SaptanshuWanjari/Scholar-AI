import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  PaperToast,
  LoadingPaper,
  SketchSkeleton,
  EmptyState,
  IllustratedEmptyState,
  ErrorCard,
  SuccessBanner,
} from '@paper-ui/components/feedback';
import { PaperButton, SketchButton } from '@paper-ui/components/buttons';
import { FolderOpen } from 'lucide-react';

const meta = {
  title: 'Components/Feedback',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const PaperToastExample = () => {
  const [toasts, setToasts] = useState<Record<string, boolean>>({});
  const show = (k: string) => setToasts(s => ({ ...s, [k]: true }));
  const hide = (k: string) => setToasts(s => ({ ...s, [k]: false }));

  const variants = ['default', 'success', 'error', 'warning'] as const;

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">PaperToast</h2>
      <div className="flex flex-wrap gap-3">
        {variants.map(v => (
          <SketchButton key={v} size="sm" onClick={() => show(v)}>
            Show {v}
          </SketchButton>
        ))}
      </div>

      {variants.map(v => (
        <PaperToast
          key={v}
          visible={!!toasts[v]}
          variant={v}
          message={`${v.charAt(0).toUpperCase() + v.slice(1)} toast`}
          description={v === 'error' ? 'Something went wrong. Please try again.' : undefined}
          onDismiss={() => hide(v)}
          timeout={3000}
        />
      ))}

      <div className="mt-8 space-y-3">
        <h3 className="font-serif text-base font-bold">Static previews</h3>
        {variants.map(v => (
          <PaperToast
            key={`static-${v}`}
            visible
            variant={v}
            message={`${v.charAt(0).toUpperCase() + v.slice(1)} message here`}
            description="This is the description line."
            onDismiss={() => {}}
            className="relative"
          />
        ))}
      </div>
    </div>
  );
};

export const LoadingPaperExample = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">LoadingPaper — variants & sizes</h2>

    {(['dots', 'lines', 'spinner'] as const).map(variant => (
      <div key={variant}>
        <h3 className="font-serif text-base font-bold mb-4">{variant}</h3>
        <div className="flex gap-10 items-end">
          {(['sm', 'md', 'lg'] as const).map(size => (
            <div key={size} className="flex flex-col items-center gap-2">
              <LoadingPaper variant={variant} size={size} />
              <span className="font-mono text-xs text-gray-500">{size}</span>
            </div>
          ))}
        </div>
      </div>
    ))}

    <div>
      <h3 className="font-serif text-base font-bold mb-4">With label</h3>
      <LoadingPaper variant="dots" label="Loading your documents…" />
    </div>
  </div>
);

export const SketchSkeletonExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SketchSkeleton — variants</h2>

    <div className="space-y-5 max-w-sm">
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">text (3 lines)</p>
        <SketchSkeleton variant="text" lines={3} />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">rect</p>
        <SketchSkeleton variant="rect" width="100%" height={80} />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">circle</p>
        <SketchSkeleton variant="circle" width={48} height={48} />
      </div>
      <div>
        <p className="font-mono text-xs text-gray-500 mb-2">card</p>
        <SketchSkeleton variant="card" width="100%" height={120} />
      </div>
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mb-3">Simulated list loading</h3>
      <div className="space-y-3 max-w-sm">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-3 items-center">
            <SketchSkeleton variant="circle" width={40} height={40} />
            <div className="flex-1">
              <SketchSkeleton variant="text" lines={2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const EmptyStateExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">EmptyState</h2>
    <div className="flex flex-col gap-6 max-w-sm">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No documents yet"
        description="Upload a PDF or paste a URL to get started."
        action={<SketchButton size="sm">Upload Document</SketchButton>}
      />
    </div>
  </div>
);

export const IllustratedEmptyStateExample = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">IllustratedEmptyState — all illustrations</h2>
    <div className="grid grid-cols-2 gap-6">
      {(['notebook', 'search', 'inbox', 'sparkle'] as const).map(illus => (
        <IllustratedEmptyState
          key={illus}
          illustration={illus}
          title={`${illus.charAt(0).toUpperCase() + illus.slice(1)} empty`}
          description="Nothing here yet. Try adding something."
          action={<SketchButton size="sm">Get Started</SketchButton>}
        />
      ))}
    </div>
  </div>
);

export const ErrorCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ErrorCard</h2>
    <div className="max-w-sm space-y-4">
      <ErrorCard title="Failed to load document" message="The file could not be parsed." />
      <ErrorCard
        title="Network Error"
        message="Could not connect to the server."
        details="ERR_CONNECTION_REFUSED at https://api.example.com/docs"
        onRetry={() => console.log('retrying…')}
      />
    </div>
  </div>
);

export const SuccessBannerExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SuccessBanner</h2>
    <div className="max-w-sm space-y-4">
      <SuccessBanner title="Document indexed!" message="Your PDF is ready to study." />
      <SuccessBanner
        title="Export complete"
        message="Your flashcards have been exported to Anki."
        onDismiss={() => {}}
        action={<SketchButton size="sm" className="mt-2">View File</SketchButton>}
      />
    </div>
  </div>
);
