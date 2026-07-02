import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline, TimelineItem } from '@paper-ui/components/dataDisplay';
import { Rocket, Lightbulb, Code2, CheckCircle2 } from 'lucide-react';

const meta = {
  title: 'Components/Composed/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj;

const timelineItems = [
  {
    title: 'Idea Generation',
    description: 'Brainstormed the core concepts and initial design directions.',
    time: 'Jan 15, 2024',
    icon: <Lightbulb size={24} strokeWidth={1.5} />,
  },
  {
    title: 'Development Phase',
    description: 'Started implementing the foundational UI components and tokens.',
    time: 'Feb 1, 2024',
    icon: <Code2 size={24} strokeWidth={1.5} />,
  },
  {
    title: 'Beta Testing',
    description: 'Released to a small group of users for feedback and bug hunting.',
    time: 'March 10, 2024',
  },
  {
    title: 'Official Launch',
    description: '1.0 release is out in the wild!',
    time: 'April 4, 2024',
    icon: <Rocket size={24} strokeWidth={1.5} />,
  },
];

export const SketchLine: Story = {
  render: () => (
    <div className="w-[500px]">
      <Timeline variant="sketch">
        {timelineItems.map((item, idx) => (
          <TimelineItem key={idx} {...item} />
        ))}
      </Timeline>
    </div>
  ),
};

export const NotebookMargin: Story = {
  render: () => (
    <div className="w-[500px]">
      <Timeline variant="notebook">
        {timelineItems.map((item, idx) => (
          <TimelineItem key={idx} {...item} />
        ))}
      </Timeline>
    </div>
  ),
};

export const DottedLine: Story = {
  render: () => (
    <div className="w-[500px]">
      <Timeline variant="dotted">
        {timelineItems.map((item, idx) => (
          <TimelineItem key={idx} {...item} />
        ))}
      </Timeline>
    </div>
  ),
};
