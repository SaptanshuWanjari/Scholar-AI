import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline, TimelineItem } from '@paper-ui/components/dataDisplay'
import { Rocket, Lightbulb, Code2 } from 'lucide-react'

const meta: Meta<typeof Timeline> = {
  title: 'Components/Composed/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Timeline>

const events = [
  { title: 'Idea', time: 'Jan 15', icon: <Lightbulb size={20} strokeWidth={1.5} /> },
  { title: 'Development', time: 'Feb 1', icon: <Code2 size={20} strokeWidth={1.5} /> },
  { title: 'Testing', time: 'Mar 10' },
  { title: 'Launch', time: 'Apr 4', icon: <Rocket size={20} strokeWidth={1.5} /> },
]

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] w-full max-w-[500px]">
      <Timeline variant="sketch">
        {events.map((item, idx) => (
          <TimelineItem key={idx} {...item} />
        ))}
      </Timeline>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-8">
      <div className="max-w-[500px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Sketch</h3>
        <Timeline variant="sketch">
          {events.map((item, idx) => (
            <TimelineItem key={idx} {...item} />
          ))}
        </Timeline>
      </div>
      <div className="max-w-[500px]">
        <h3 className="font-caveat text-lg text-ink-muted/70 mb-3">Dotted</h3>
        <Timeline variant="dotted">
          {events.map((item, idx) => (
            <TimelineItem key={idx} {...item} />
          ))}
        </Timeline>
      </div>
    </div>
  ),
}
