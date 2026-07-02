import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from '@paper-ui/components/feedback'
import { SketchButton } from '@paper-ui/components/buttons'
import { FolderOpen } from 'lucide-react'

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No documents yet"
        description="Upload a PDF or paste a URL to get started."
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-6 bg-[#f4f1ea] max-w-sm">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No documents yet"
        description="Upload a PDF or paste a URL to get started."
      />
      <EmptyState
        title="Nothing found"
        description="Try adjusting your search terms."
      />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <EmptyState
        icon={<FolderOpen size={32} strokeWidth={1.5} />}
        title="No documents yet"
        description="Upload a PDF or paste a URL to get started."
        action={<SketchButton size="sm">Upload Document</SketchButton>}
      />
    </div>
  ),
}
