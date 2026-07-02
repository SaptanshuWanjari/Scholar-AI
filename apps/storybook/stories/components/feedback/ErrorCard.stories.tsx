import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorCard } from '@paper-ui/components/feedback'

const meta: Meta<typeof ErrorCard> = {
  title: 'Components/Feedback/ErrorCard',
  component: ErrorCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof ErrorCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-sm">
      <ErrorCard title="Failed to load document" message="The file could not be parsed." />
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea] max-w-sm">
      <ErrorCard title="Failed to load document" message="The file could not be parsed." />
      <ErrorCard
        title="Network Error"
        message="Could not connect to the server."
        details="ERR_CONNECTION_REFUSED at https://api.example.com/docs"
        onRetry={() => console.log('retrying…')}
      />
    </div>
  ),
}
