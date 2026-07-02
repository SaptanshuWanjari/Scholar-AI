import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Card } from '@paper-ui/components/card';
import { SketchButton, GhostButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Wrappers/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `## Card

A versatile card component with composable sub-components for building study-oriented content blocks. Supports paper and sticky-note variants with sketch borders, media, headers, content areas, footers, and action bars.

### Sub-components
- **Card.Header** — title + description section
- **Card.Title** — card heading with optional marker dot
- **Card.Description** — subtitle / summary text
- **Card.Media** — image area with sketch border
- **Card.Content** — main body content
- **Card.Footer** — bottom bar with metadata
- **Card.Actions** — action button row

### Variants
- **paper** (default) — sketch border with paper texture
- **sticky** — solid sticky-note yellow with casual rotation`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

export const Default = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <Card className="max-w-sm">
      <Card.Header>
        <Card.Title marker>Machine Learning</Card.Title>
        <Card.Description>
          A comprehensive introduction to neural networks, gradient descent, and model evaluation techniques.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          This course covers the fundamentals of machine learning including supervised and unsupervised learning,
          feature engineering, and practical applications with real-world datasets.
        </p>
      </Card.Content>
      <Card.Footer>
        <SketchButton size="sm">Learn More</SketchButton>
        <span className="font-architect text-[11px] text-ink-muted ml-auto">12 lessons</span>
      </Card.Footer>
      <Card.Actions>
        <GhostButton size="sm">Bookmark</GhostButton>
        <GhostButton size="sm">Share</GhostButton>
      </Card.Actions>
    </Card>
  </div>
);

export const Sticky = () => (
  <div className="p-10 bg-[#f4f1ea] flex justify-center">
    <Card variant="sticky" className="max-w-xs">
      <Card.Header>
        <Card.Title>Reminder!</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          Don&apos;t forget to review backpropagation before the exam tomorrow. Focus on the chain rule derivation.
        </p>
      </Card.Content>
      <Card.Footer>
        <span className="font-architect text-[11px] text-ink-muted">pinned 2h ago</span>
      </Card.Footer>
    </Card>
  </div>
);

export const Media = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <Card className="max-w-sm">
      <Card.Media
        src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop"
        alt="Sketchbook and pencils"
      />
      <Card.Header>
        <Card.Title marker>Creative Doodles</Card.Title>
        <Card.Description>
          Express ideas through simple hand-drawn illustrations and visual notes.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
          Doodling helps reinforce learning by engaging visual and motor skills. Try sketching key concepts
          from each chapter.
        </p>
      </Card.Content>
      <Card.Footer>
        <SketchButton size="sm">View Gallery</SketchButton>
      </Card.Footer>
    </Card>
  </div>
);

export const Variants = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <h2 className="font-caveat text-[28px] font-bold text-ink mb-6">Card Variants</h2>
    <div className="flex flex-wrap gap-8 items-start">
      <Card className="max-w-xs">
        <Card.Header>
          <Card.Title marker>Paper Card</Card.Title>
          <Card.Description>Standard wobbly sketch border with paper texture.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
            Featuring sketch borders, paper texture, and a tape decoration in the corner.
          </p>
        </Card.Content>
        <Card.Footer>
          <span className="font-architect text-[11px] text-ink-muted">variant: paper</span>
        </Card.Footer>
      </Card>

      <Card variant="sticky" className="max-w-xs">
        <Card.Header>
          <Card.Title>Sticky Card</Card.Title>
        </Card.Header>
        <Card.Content>
          <p className="font-kalam text-[14px] text-ink/70 leading-relaxed">
            Solid sticky note yellow background with a slight rotation for that casual pinned look.
          </p>
        </Card.Content>
        <Card.Footer>
          <span className="font-architect text-[11px] text-ink-muted">variant: sticky</span>
        </Card.Footer>
      </Card>
    </div>
  </div>
);

export const Gallery = () => (
  <div className="p-12 bg-[#f4f1ea] min-h-screen relative overflow-hidden">
    <h2 className="font-caveat text-[32px] font-bold text-ink text-center mb-10">
      Doodle Card Gallery
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative">
      {/* Top-left: Paper card with media */}
      <div style={{ transform: 'rotate(-1.5deg)' }}>
        <Card className="h-full">
          <Card.Media
            src="https://images.unsplash.com/photo-1507003211169-0a1dd700be67?w=400&h=250&fit=crop"
            alt="Notebook on desk"
          />
          <Card.Header>
            <Card.Title>Study Notes</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="font-kalam text-[13px] text-ink/70 leading-relaxed">
              Organize your thoughts with hand-written style notes. Doodles and sketches help memory retention.
            </p>
          </Card.Content>
        </Card>
      </div>

      {/* Top-center: Sticky note */}
      <div style={{ transform: 'rotate(0.8deg)' }}>
        <Card variant="sticky" className="h-full">
          <Card.Header>
            <Card.Title>Quick Idea</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="font-kalam text-[13px] text-ink/70 leading-relaxed">
              What if we used spaced repetition with doodle-based flashcards? Visual memory is powerful.
            </p>
          </Card.Content>
          <Card.Actions>
            <GhostButton size="sm">Pin</GhostButton>
          </Card.Actions>
        </Card>
      </div>

      {/* Top-right: Paper card with footer */}
      <div style={{ transform: 'rotate(1.2deg)' }}>
        <Card className="h-full">
          <Card.Header>
            <Card.Title marker>Flashcards</Card.Title>
            <Card.Description>
              32 cards ready for review
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="font-kalam text-[13px] text-ink/70 leading-relaxed">
              Practice neural network terminology with hand-drawn diagrams on the back of each card.
            </p>
          </Card.Content>
          <Card.Footer>
            <SketchButton size="sm">Review Now</SketchButton>
            <span className="font-architect text-[11px] text-ink-muted ml-auto">due today</span>
          </Card.Footer>
        </Card>
      </div>

      {/* Bottom-left: Simple content card */}
      <div style={{ transform: 'rotate(-0.5deg)' }}>
        <Card className="h-full">
          <Card.Header>
            <Card.Title marker>Concepts</Card.Title>
          </Card.Header>
          <Card.Content>
            <ul className="font-kalam text-[13px] text-ink/70 space-y-1.5 list-disc list-inside">
              <li>Gradient Descent</li>
              <li>Backpropagation</li>
              <li>Attention Mechanism</li>
              <li>Dropout Regularization</li>
            </ul>
          </Card.Content>
          <Card.Footer>
            <span className="font-architect text-[11px] text-ink-muted">4 of 12 mastered</span>
          </Card.Footer>
        </Card>
      </div>

      {/* Bottom-center: Sticky note */}
      <div style={{ transform: 'rotate(-1.8deg)' }}>
        <Card variant="sticky" className="h-full">
          <Card.Header>
            <Card.Title>Exam Prep</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="font-kalam text-[13px] text-ink/70 leading-relaxed">
              Review chapters 4-7. Focus on practice problems at the end of each section.
            </p>
          </Card.Content>
          <Card.Actions>
            <GhostButton size="sm">Start Quiz</GhostButton>
          </Card.Actions>
        </Card>
      </div>

      {/* Bottom-right: Card with actions */}
      <div style={{ transform: 'rotate(0.4deg)' }}>
        <Card className="h-full">
          <Card.Header>
            <Card.Title>Resources</Card.Title>
            <Card.Description>
              Helpful study materials
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="font-kalam text-[13px] text-ink/70 leading-relaxed">
              Download lecture slides, practice exams, and additional reading materials for the course.
            </p>
          </Card.Content>
          <Card.Actions>
            <SketchButton size="sm">Download</SketchButton>
            <GhostButton size="sm">Preview</GhostButton>
          </Card.Actions>
        </Card>
      </div>
    </div>
  </div>
);
