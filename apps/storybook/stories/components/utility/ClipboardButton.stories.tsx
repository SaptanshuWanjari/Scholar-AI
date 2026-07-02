import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ClipboardButton } from '@paper-ui/components/utility'

const meta: Meta<typeof ClipboardButton> = {
  title: 'Components/Utility/ClipboardButton',
  component: ClipboardButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof ClipboardButton>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <ClipboardButton content="Hello world" contentType="text" preview />
    </div>
  ),
}

export const ContentTypes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <ClipboardButton content="Plain text content" contentType="text" preview label="Text" />
      <ClipboardButton content="const x = 42;" contentType="code" preview label="Code" />
      <ClipboardButton content="https://example.com" contentType="link" preview label="Link" />
    </div>
  ),
}

export const Preview: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-3">
      <ClipboardButton content="Short text" contentType="text" preview label="With preview" />
      <ClipboardButton content="No preview shown" contentType="text" preview={false} label="Without preview" />
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-4">
      <ClipboardButton content="test">
        <ClipboardButton.Icon copied={false} contentType="text" />
        <ClipboardButton.Preview content="test" contentType="code" />
      </ClipboardButton>
    </div>
  ),
}
