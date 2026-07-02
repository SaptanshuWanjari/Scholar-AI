import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnchorLink } from '@paper-ui/components/utility'

const meta: Meta<typeof AnchorLink> = {
  title: 'Components/Utility/AnchorLink',
  component: AnchorLink,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof AnchorLink>

export const Playground: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <AnchorLink id="intro" as="h2">Getting Started</AnchorLink>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <AnchorLink id="h1" as="h1">Heading 1</AnchorLink>
      <AnchorLink id="h2" as="h2">Heading 2</AnchorLink>
      <AnchorLink id="h3" as="h3">Heading 3</AnchorLink>
      <AnchorLink id="h4" as="h4">Heading 4</AnchorLink>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-6">
      <div className="group relative">
        <AnchorLink.Heading as="h2">Custom Heading</AnchorLink.Heading>
        <AnchorLink.Link
          visible={true}
          copied={false}
          onClick={() => {}}
          className="absolute left-[-1.75rem] top-1/2 -translate-y-1/2"
        />
      </div>
      <div className="group relative">
        <AnchorLink.Heading as="h3">Using Icon</AnchorLink.Heading>
        <AnchorLink.Icon size={16} />
      </div>
    </div>
  ),
}
