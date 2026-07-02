import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FloatingToolbar } from '@paper-ui/components/overlays'
import { IconButton } from '@paper-ui/components/buttons'
import { Caption } from '@paper-ui/components/typography'
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
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Select any text below to see the floating toolbar.</Caption>
      <div className="mt-4 p-6 bg-white border border-[#d4cfc2] rounded-lg max-w-2xl">
        <p className="font-kalam text-base text-[#3a3733] leading-relaxed">
          The transformer architecture, introduced in the paper
          <em> "Attention Is All You Need"</em>, revolutionized natural language
          processing by replacing recurrent connections with self-attention
          mechanisms. This allowed models to process entire sequences in parallel,
          dramatically improving training efficiency and enabling the scaling
          that led to modern large language models.
        </p>
        <p className="font-kalam text-base text-[#3a3733] leading-relaxed mt-3">
          Select any phrase to see formatting options appear. The toolbar follows
          text selection and positions itself near the highlighted text.
        </p>
      </div>
      <FloatingToolbar offsetY={8}>
        <IconButton aria-label="Bold"><strong>B</strong></IconButton>
        <IconButton aria-label="Italic"><em>I</em></IconButton>
        <IconButton aria-label="Copy"><Copy size={14} /></IconButton>
        <IconButton aria-label="Edit"><Edit3 size={14} /></IconButton>
      </FloatingToolbar>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Select any text below to see the floating toolbar with extended actions.</Caption>
      <div className="mt-4 p-6 bg-white border border-[#d4cfc2] rounded-lg max-w-2xl">
        <p className="font-kalam text-base text-[#3a3733] leading-relaxed">
          The transformer architecture, introduced in the paper
          <em> "Attention Is All You Need"</em>, revolutionized natural language
          processing by replacing recurrent connections with self-attention
          mechanisms.
        </p>
      </div>
      <FloatingToolbar offsetY={8}>
        <IconButton aria-label="Bold"><strong>B</strong></IconButton>
        <IconButton aria-label="Italic"><em>I</em></IconButton>
        <IconButton aria-label="Underline"><u>U</u></IconButton>
        <IconButton aria-label="Strikethrough"><s>S</s></IconButton>
        <div className="w-px h-4 bg-[#d4cfc2]" />
        <IconButton aria-label="Copy"><Copy size={14} /></IconButton>
        <IconButton aria-label="Edit"><Edit3 size={14} /></IconButton>
      </FloatingToolbar>
    </div>
  ),
}
