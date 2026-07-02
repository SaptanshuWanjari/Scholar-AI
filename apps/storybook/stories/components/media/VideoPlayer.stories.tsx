import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VideoPlayer } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Components/Media/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof VideoPlayer>

const VIDEO_SRC = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
const POSTER = 'https://picsum.photos/seed/video/720/405'

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>MP4 video with custom paper controls</Caption>
      <div className="mt-3 max-w-2xl w-full">
        <VideoPlayer
          src={VIDEO_SRC}
          poster={POSTER}
          width="100%"
          height={360}
        />
      </div>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>Loading state</Caption>
        <div className="mt-3 max-w-2xl w-full">
          <VideoPlayer
            src={VIDEO_SRC}
            poster={POSTER}
            width="100%"
            height={360}
          />
        </div>
      </section>

      <section className="space-y-2">
        <Caption>Error state (broken src)</Caption>
        <div className="mt-3 max-w-2xl w-full">
          <VideoPlayer
            src="https://example.com/broken.mp4"
            poster={POSTER}
            width="100%"
            height={360}
          />
        </div>
      </section>
    </div>
  ),
}
