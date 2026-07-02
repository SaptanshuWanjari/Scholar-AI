import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvatarGroup } from '@paper-ui/components/media'

const meta: Meta<typeof AvatarGroup> = {
  title: 'Components/Media/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <AvatarGroup
        avatars={[
          { src: 'https://placehold.co/80x80', name: 'Alice Chen' },
          { src: 'https://placehold.co/80x80', name: 'Bob Miller' },
          { src: 'https://placehold.co/80x80', name: 'Carol Wu' },
          { src: 'https://placehold.co/80x80', name: 'David Park' },
          { name: 'Eva Torres' },
        ]}
        size={36}
      />
    </div>
  ),
}

export const WithOverflow: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <AvatarGroup
        avatars={[
          { src: 'https://placehold.co/80x80', name: 'Alice Chen' },
          { src: 'https://placehold.co/80x80', name: 'Bob Miller' },
          { src: 'https://placehold.co/80x80', name: 'Carol Wu' },
          { src: 'https://placehold.co/80x80', name: 'David Park' },
          { name: 'Eva Torres' },
          { name: 'Frank Li' },
          { name: 'Grace Kim' },
        ]}
        max={4}
        size={36}
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="p-8 flex flex-col gap-6 bg-[#f4f1ea]">
      <AvatarGroup
        avatars={[
          { name: 'Alice Chen' },
          { name: 'Bob Miller' },
          { name: 'Carol Wu' },
        ]}
        size={32}
      />
      <AvatarGroup
        avatars={[
          { name: 'Alice Chen' },
          { name: 'Bob Miller' },
          { name: 'Carol Wu' },
        ]}
        size={44}
      />
      <AvatarGroup
        avatars={[
          { name: 'Alice Chen' },
          { name: 'Bob Miller' },
          { name: 'Carol Wu' },
        ]}
        size={56}
      />
    </div>
  ),
}
