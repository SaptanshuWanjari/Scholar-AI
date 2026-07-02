import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SketchSkeleton } from '@paper-ui/components/feedback'

const meta: Meta<typeof SketchSkeleton> = {
  title: 'Components/Feedback/SketchSkeleton',
  component: SketchSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SketchSkeleton>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-5 bg-[#f4f1ea] max-w-sm">
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
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <SketchSkeleton variant="text" lines={3} />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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
  ),
}
