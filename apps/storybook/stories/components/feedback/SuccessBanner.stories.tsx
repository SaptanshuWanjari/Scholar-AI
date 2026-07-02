import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SuccessBanner } from '@paper-ui/components/feedback'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof SuccessBanner> = {
  title: 'Components/Feedback/SuccessBanner',
  component: SuccessBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof SuccessBanner>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <SuccessBanner title="Document indexed!" message="Your PDF is ready to study." />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <SuccessBanner
        title="Export complete"
        message="Your flashcards have been exported to Anki."
        onDismiss={() => {}}
        action={<SketchButton size="sm" className="mt-2">View File</SketchButton>}
      />
    </div>
  ),
}
