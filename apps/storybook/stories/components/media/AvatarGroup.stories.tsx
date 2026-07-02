import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AvatarGroup } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

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
    <div className="p-10 bg-[#f4f1ea]">
      <AvatarGroup
        avatars={[
          { src: 'https://picsum.photos/seed/ava1/80/80', name: 'Alice Chen' },
          { src: 'https://picsum.photos/seed/ava2/80/80', name: 'Bob Miller' },
          { src: 'https://picsum.photos/seed/ava3/80/80', name: 'Carol Wu' },
        ]}
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>With images</Caption>
        <AvatarGroup
          avatars={[
            { src: 'https://picsum.photos/seed/ava1/80/80', name: 'Alice Chen' },
            { src: 'https://picsum.photos/seed/ava2/80/80', name: 'Bob Miller' },
            { src: 'https://picsum.photos/seed/ava3/80/80', name: 'Carol Wu' },
          ]}
        />
      </section>

      <section className="space-y-2">
        <Caption>Initials fallback, size=40</Caption>
        <AvatarGroup
          avatars={[
            { name: 'Alice Chen' },
            { name: 'Bob Miller' },
            { name: 'Carol Wu' },
            { name: 'David Park' },
          ]}
          size={40}
        />
      </section>

      <section className="space-y-2">
        <Caption>Mixed images + initials, size=48</Caption>
        <AvatarGroup
          avatars={[
            { src: 'https://picsum.photos/seed/ava4/100/100', name: 'Grace Kim' },
            { name: 'Henry Jones' },
            { src: 'https://picsum.photos/seed/ava5/100/100', name: 'Iris Vega' },
          ]}
          size={48}
        />
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Overflow (max=4, 6 avatars)</Caption>
        <AvatarGroup
          avatars={[
            { name: 'Alice Chen' },
            { name: 'Bob Miller' },
            { name: 'Carol Wu' },
            { name: 'David Park' },
            { name: 'Eva Torres' },
            { name: 'Frank Li' },
          ]}
          max={4}
          size={40}
        />
      </section>
    </div>
  ),
}
