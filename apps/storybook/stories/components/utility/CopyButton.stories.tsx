import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CopyButton } from '@paper-ui/components/utility'

const meta: Meta<typeof CopyButton> = {
  title: 'Components/Utility/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof CopyButton>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <CopyButton text="Hello, world!" label="Copy" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 flex flex-col w-fit">
      <CopyButton text="Small button" size="sm" label="Copy" />
      <CopyButton text="Medium button" size="md" label="Copy" />
    </div>
  ),
}

export const CustomLabel: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3 flex flex-col w-fit">
      <CopyButton text="npm install" label="Copy command" copiedLabel="Command copied!" />
      <CopyButton text="git@github.com:user/repo" label="Copy URL" copiedLabel="URL copied!" />
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <CopyButton text="custom">
        <CopyButton.Icon copied={false} size={14} />
        <CopyButton.Label copied={false} label="Copy" copiedLabel="Copied!" />
      </CopyButton>
      <div className="flex gap-2">
        <CopyButton text="toast" />
        <CopyButton.Toast copied={false} />
      </div>
    </div>
  ),
}
