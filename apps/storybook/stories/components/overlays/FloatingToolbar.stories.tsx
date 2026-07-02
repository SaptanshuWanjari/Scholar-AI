import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingToolbar } from '@paper-ui/components/overlays'
import { IconButton } from '@paper-ui/components/buttons'
import { Copy, Edit3 } from 'lucide-react'

const meta: Meta<typeof FloatingToolbar> = {
  title: 'Components/Overlays/FloatingToolbar',
  component: FloatingToolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof FloatingToolbar>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <p className="text-sm text-[#6b6055] mb-4">Select any text below to see the floating toolbar.</p>
      <div className="p-6 bg-white border border-[#d4cfc2] rounded-lg max-w-2xl">
        <p className="font-kalam text-sm text-[#3a3733] leading-relaxed">
          The transformer architecture revolutionized natural language processing by replacing recurrent connections with self-attention mechanisms. This allowed models to process entire sequences in parallel, dramatically improving training efficiency.
        </p>
      </div>
      <FloatingToolbar offsetY={8}>
        <IconButton label="Bold"><strong>B</strong></IconButton>
        <IconButton label="Italic"><em>I</em></IconButton>
        <IconButton label="Copy"><Copy size={14} /></IconButton>
        <IconButton label="Edit"><Edit3 size={14} /></IconButton>
      </FloatingToolbar>
    </div>
  ),
}

export const WithSeparators: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <p className="text-sm text-[#6b6055] mb-4">Select text to see extended toolbar options.</p>
      <div className="p-6 bg-white border border-[#d4cfc2] rounded-lg max-w-2xl">
        <p className="font-kalam text-sm text-[#3a3733] leading-relaxed">
          Transformers enable parallel processing of sequences, replacing sequential recurrence with self-attention. This fundamental shift allows modern language models to scale effectively.
        </p>
      </div>
      <FloatingToolbar offsetY={8}>
        <IconButton label="Bold"><strong>B</strong></IconButton>
        <IconButton label="Italic"><em>I</em></IconButton>
        <IconButton label="Underline"><u>U</u></IconButton>
        <div className="w-px h-4 bg-[#d4cfc2]" />
        <IconButton label="Copy"><Copy size={14} /></IconButton>
        <IconButton label="Edit"><Edit3 size={14} /></IconButton>
      </FloatingToolbar>
    </div>
  ),
}
