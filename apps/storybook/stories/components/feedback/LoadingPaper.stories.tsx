import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoadingPaper } from '@paper-ui/components/feedback'

const meta: Meta<typeof LoadingPaper> = {
  title: 'Components/Feedback/LoadingPaper',
  component: LoadingPaper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof LoadingPaper>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <LoadingPaper variant="dots" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-10 bg-[#f4f1ea]">
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
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <LoadingPaper variant="dots" label="Loading your documents…" />
    </div>
  ),
}
