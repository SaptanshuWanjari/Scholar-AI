import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadingOverlay } from '@paper-ui/components/loading';
import { SketchButton } from '@paper-ui/components/buttons';

const meta: Meta<typeof LoadingOverlay> = {
  title: 'Components/Loading/LoadingOverlay',
  component: LoadingOverlay,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Basic: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">LoadingOverlay — Basic</h2>
      <div className="relative w-72 h-40 bg-white rounded-lg border border-gray-200">
        <LoadingOverlay>
          <LoadingOverlay.Content message="Loading…" />
        </LoadingOverlay>
      </div>
    </div>
  ),
};

export const WithBlur: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">LoadingOverlay — With Blur</h2>
      <div className="relative w-72 h-40 bg-white rounded-lg border border-gray-200 p-4">
        <p className="font-architect text-sm">This content is blurred behind the overlay.</p>
        <LoadingOverlay blur>
          <LoadingOverlay.Content message="Indexing documents…" spinnerVariant="spin" />
        </LoadingOverlay>
      </div>
    </div>
  ),
};

export const SpinnerVariants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">LoadingOverlay — Spinner Variants</h2>
      <div className="flex flex-wrap gap-6">
        {(['bounce', 'spin', 'pulse', 'scribble'] as const).map(variant => (
          <div key={variant} className="relative w-44 h-32 bg-white rounded-lg border border-gray-200">
            <LoadingOverlay>
              <LoadingOverlay.Content message={variant} spinnerVariant={variant} />
            </LoadingOverlay>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ToggleVisibility: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="p-10 space-y-4 bg-[#f4f1ea]">
        <h2 className="font-architect text-xl font-bold">LoadingOverlay — Toggle</h2>
        <SketchButton onClick={() => setVisible(v => !v)}>
          {visible ? 'Hide overlay' : 'Show overlay'}
        </SketchButton>
        <div className="relative w-72 h-48 bg-white rounded-lg border border-gray-200 p-4">
          <p className="font-architect text-sm">Some content underneath.</p>
          <LoadingOverlay visible={visible} blur>
            <LoadingOverlay.Content message="Processing…" spinnerVariant="scribble" />
          </LoadingOverlay>
        </div>
      </div>
    );
  },
};

export const Compound: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <h2 className="font-architect text-xl font-bold">LoadingOverlay — Compound Usage</h2>
      <div className="relative w-72 h-40 bg-white rounded-lg border border-gray-200">
        <LoadingOverlay>
          <LoadingOverlay.Backdrop opacity={0.6} />
          <LoadingOverlay.Content message="Custom layout" spinnerVariant="spin" />
        </LoadingOverlay>
      </div>
    </div>
  ),
};
