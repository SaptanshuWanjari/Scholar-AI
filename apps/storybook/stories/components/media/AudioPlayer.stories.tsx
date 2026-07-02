import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AudioPlayer } from '@paper-ui/components/media'

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/Media/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof AudioPlayer>

const audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-md">
      <AudioPlayer src={audioSrc} title="Lecture Audio" />
    </div>
  ),
}

export const Compact: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-sm">
      <AudioPlayer src={audioSrc} />
    </div>
  ),
}
