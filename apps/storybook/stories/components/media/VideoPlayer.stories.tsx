import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoPlayer } from '@paper-ui/components/media'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/Media/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VideoPlayer>

const videoSrc = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
const posterSrc = 'https://placehold.co/720x405'

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <VideoPlayer
        src={videoSrc}
        poster={posterSrc}
        width="100%"
        height={360}
      />
    </div>
  ),
}
