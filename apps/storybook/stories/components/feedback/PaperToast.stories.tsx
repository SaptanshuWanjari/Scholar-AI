import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperToast } from '@paper-ui/components/feedback'
import { SketchButton } from '@paper-ui/components/buttons'

const meta: Meta<typeof PaperToast> = {
  title: 'Components/Feedback/PaperToast',
  component: PaperToast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof PaperToast>

export const Playground: Story = {
  render: () => {
    const [toasts, setToasts] = useState<Record<string, boolean>>({})
    const show = (k: string) => setToasts(s => ({ ...s, [k]: true }))
    const hide = (k: string) => setToasts(s => ({ ...s, [k]: false }))
    const variants = ['default', 'success', 'error', 'warning'] as const

    return (
      <div className="p-10 space-y-6 bg-[#f4f1ea]">
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
      </div>
    )
  },
}

export const Variants: Story = {
  render: () => {
    const variants = ['default', 'success', 'error', 'warning'] as const
    return (
      <div className="p-10 space-y-3 bg-[#f4f1ea]">
        {variants.map(v => (
          <PaperToast
            key={v}
            visible
            variant={v}
            message={`${v.charAt(0).toUpperCase() + v.slice(1)} message here`}
            description="This is the description line."
            onDismiss={() => {}}
            className="relative"
          />
        ))}
      </div>
    )
  },
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-4 bg-[#f4f1ea]">
      <PaperToast
        visible
        variant="success"
        message="Operation completed"
        description="Your file has been saved."
        onDismiss={() => {}}
        className="relative"
      />
      <PaperToast
        visible={false}
        variant="success"
        message="Dismissed toast"
        description="This toast is not visible."
        onDismiss={() => {}}
        className="relative"
      />
    </div>
  ),
}
