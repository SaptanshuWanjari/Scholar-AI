import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Card } from '@paper-ui/components/card';
import { SketchButton, GhostButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Wrappers/Card',
  component: Card,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

export const Default = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <Card className="max-w-sm">
      <Card.Header>
        <Card.Title marker>Machine Learning</Card.Title>
        <Card.Description>A comprehensive introduction to neural networks and gradient descent.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          This course covers supervised learning, feature engineering, and practical applications.
        </p>
      </Card.Content>
      <Card.Footer>
        <SketchButton size="sm">Learn More</SketchButton>
        <span className="font-architect text-[11px] text-ink-muted ml-auto">12 lessons</span>
      </Card.Footer>
    </Card>
  </div>
);

export const Sticky = () => (
  <div className="p-8 bg-[#f4f1ea] flex justify-center">
    <Card variant="sticky" className="max-w-xs">
      <Card.Header>
        <Card.Title>Reminder!</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          Review backpropagation before the exam tomorrow. Focus on the chain rule derivation.
        </p>
      </Card.Content>
      <Card.Footer>
        <span className="font-architect text-[11px] text-ink-muted">pinned 2h ago</span>
      </Card.Footer>
    </Card>
  </div>
);

export const WithMedia = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <Card className="max-w-sm">
      <Card.Media
        src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop"
        alt="Sketchbook and pencils"
      />
      <Card.Header>
        <Card.Title marker>Creative Doodles</Card.Title>
        <Card.Description>Express ideas through hand-drawn illustrations and visual notes.</Card.Description>
      </Card.Header>
      <Card.Footer>
        <SketchButton size="sm">View Gallery</SketchButton>
      </Card.Footer>
    </Card>
  </div>
);

export const Variants = () => (
  <div className="p-8 bg-[#f4f1ea] flex flex-wrap gap-6 items-start">
    <Card className="max-w-xs">
      <Card.Header>
        <Card.Title marker>Paper Card</Card.Title>
        <Card.Description>Standard sketch border with paper texture.</Card.Description>
      </Card.Header>
      <Card.Footer>
        <span className="font-architect text-[11px] text-ink-muted">variant: paper</span>
      </Card.Footer>
    </Card>
    <Card variant="sticky" className="max-w-xs">
      <Card.Header>
        <Card.Title>Sticky Card</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">Casual pinned look.</p>
      </Card.Content>
      <Card.Footer>
        <span className="font-architect text-[11px] text-ink-muted">variant: sticky</span>
      </Card.Footer>
    </Card>
  </div>
);

export const WithActions = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <Card className="max-w-sm">
      <Card.Header>
        <Card.Title marker>Flashcards</Card.Title>
        <Card.Description>32 cards ready for review</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          Practice neural network terminology — due today.
        </p>
      </Card.Content>
      <Card.Footer>
        <SketchButton size="sm">Review Now</SketchButton>
        <span className="font-architect text-[11px] text-ink-muted ml-auto">due today</span>
      </Card.Footer>
      <Card.Actions>
        <GhostButton size="sm">Bookmark</GhostButton>
        <GhostButton size="sm">Share</GhostButton>
      </Card.Actions>
    </Card>
  </div>
);
