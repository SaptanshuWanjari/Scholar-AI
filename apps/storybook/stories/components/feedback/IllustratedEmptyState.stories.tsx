import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { IllustratedEmptyState } from '@paper-ui/components/feedback'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof IllustratedEmptyState> = {
  title: 'Components/Feedback/IllustratedEmptyState',
  component: IllustratedEmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof IllustratedEmptyState>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <IllustratedEmptyState
        illustration="notebook"
        title="Notebook empty"
        description="Nothing here yet. Try adding something."
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="grid grid-cols-2 gap-6">
        {(['notebook', 'search', 'inbox', 'sparkle'] as const).map(illus => (
          <IllustratedEmptyState
            key={illus}
            illustration={illus}
            title={`${illus.charAt(0).toUpperCase() + illus.slice(1)} empty`}
            description="Nothing here yet. Try adding something."
          />
        ))}
      </div>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <IllustratedEmptyState
        illustration="search"
        title="Search empty"
        description="Nothing here yet. Try adding something."
        action={<SketchButton size="sm">Get Started</SketchButton>}
      />
    </div>
  ),
}
