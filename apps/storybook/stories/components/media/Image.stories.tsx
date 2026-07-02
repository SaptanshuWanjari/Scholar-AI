import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Image } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

function Small({ children }: { children: React.ReactNode }) {
  return <span className="font-architect text-xs text-[#9c9484]">{children}</span>
}

const meta: Meta<typeof Image> = {
  title: 'Components/Media/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Image>

export const Playground: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <Image
        src="https://picsum.photos/seed/notes1/400/300"
        alt="Study notes spread on a desk"
        caption="Fig 1. Annotated lecture notes from Week 3"
        width={300}
        aspectRatio="4/3"
      />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Image
        src="https://picsum.photos/seed/notes1/400/300"
        alt="Study notes spread on a desk"
        caption="Fig 1. Annotated lecture notes from Week 3"
        width={300}
        aspectRatio="4/3"
      />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-3">
        <Caption>rounded=md, aspectRatio=4/3</Caption>
        <Image
          src="https://picsum.photos/seed/notes1/400/300"
          alt="Study notes spread on a desk"
          caption="Fig 1. Annotated lecture notes from Week 3"
          width={300}
          aspectRatio="4/3"
        />
      </section>

      <section className="space-y-3">
        <Caption>rounded=full, width=160</Caption>
        <Image
          src="https://picsum.photos/seed/profile1/200/200"
          alt="Author portrait"
          rounded="full"
          width={160}
          aspectRatio="1/1"
          objectFit="cover"
        />
      </section>

      <section className="space-y-3">
        <Caption>rounded=sm, aspectRatio=16/9</Caption>
        <Image
          src="https://picsum.photos/seed/diagram1/640/360"
          alt="Neural network architecture diagram"
          width={400}
          aspectRatio="16/9"
          rounded="sm"
        />
      </section>

      <section className="flex gap-4 flex-wrap">
        {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
          <div key={r} className="text-center space-y-1">
            <Image
              src={`https://picsum.photos/seed/round_${r}/120/120`}
              alt={`rounded ${r}`}
              width={100}
              aspectRatio="1/1"
              rounded={r}
            />
            <Small>{r}</Small>
          </div>
        ))}
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>With caption</Caption>
        <Image
          src="https://picsum.photos/seed/notes1/400/300"
          alt="Study notes"
          caption="Fig 1. Annotated lecture notes"
          width={300}
          aspectRatio="4/3"
        />
      </section>

      <section className="space-y-2">
        <Caption>Without caption</Caption>
        <Image
          src="https://picsum.photos/seed/notes1/400/300"
          alt="Study notes"
          width={300}
          aspectRatio="4/3"
        />
      </section>

      <section className="space-y-2">
        <Caption>Loading state (broken src)</Caption>
        <Image
          src=""
          alt="Will show fallback"
          width={300}
          aspectRatio="4/3"
        />
      </section>
    </div>
  ),
}
