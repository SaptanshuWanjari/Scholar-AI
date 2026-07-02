import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AudioPlayer } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/Media/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof AudioPlayer>

const AUDIO_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-md">
      <Caption>Audio player with paper styling</Caption>
      <AudioPlayer
        src={AUDIO_SRC}
        title="Lecture Recording — Week 4"
      />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea] max-w-md">
      <section className="space-y-2">
        <Caption>With title</Caption>
        <AudioPlayer
          src={AUDIO_SRC}
          title="Lecture Recording — Week 4"
        />
      </section>

      <section className="space-y-2">
        <Caption>Buffering state</Caption>
        <AudioPlayer
          src={AUDIO_SRC}
          title="Loading..."
        />
      </section>
    </div>
  ),
}
