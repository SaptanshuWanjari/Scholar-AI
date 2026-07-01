import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  ConceptNode,
  KnowledgeNode,
  KnowledgeGraphNode,
  PrerequisiteCard,
  LearningStepCard,
  QuizRecommendation,
  StudyRecommendation,
  ConceptEdgeLabel,
  MasteryFilterGroup,
} from '@paper-ui/components/teaching';
import { DifficultyBadge, Pill, CourseTag } from '@paper-ui/components/badges';
import { SketchButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Teaching',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const ConceptNodeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ConceptNode — mastery levels</h2>
    <div className="flex flex-wrap gap-4">
      {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
        <ConceptNode
          key={mastery}
          title={`${mastery.charAt(0).toUpperCase() + mastery.slice(1)} Concept`}
          description="A fundamental idea in the domain that builds on previous knowledge."
          mastery={mastery}
          badge={<DifficultyBadge difficulty="Medium" />}
          meta="8 sources"
          className="max-w-[220px] w-full"
        />
      ))}
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mt-6 mb-3">With actions</h3>
      <ConceptNode
        title="Gradient Descent"
        description="Optimization algorithm that moves in the direction of the negative gradient to minimize loss."
        mastery="learning"
        badge={<DifficultyBadge difficulty="Medium" />}
        meta="12 sources"
        actions={<SketchButton size="sm">Study</SketchButton>}
        onClick={() => console.log('clicked')}
        className="max-w-xs"
      />
    </div>
  </div>
);

export const KnowledgeNodeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">KnowledgeNode</h2>
    <div className="flex flex-wrap gap-4">
      <KnowledgeNode
        title="Backpropagation"
        summary="Algorithm for computing gradients by propagating errors backward through layers."
        mastery="learning"
        tags={[
          <CourseTag key="ml" course="ML" />,
          <DifficultyBadge key="d" difficulty="Hard" />,
        ]}
        stats={[
          { label: 'Sources', value: '8' },
          { label: 'Flashcards', value: '14' },
          { label: 'Reviews', value: '5' },
        ]}
        actions={<SketchButton size="sm">Review</SketchButton>}
        className="w-72"
      />
      <KnowledgeNode
        title="Softmax Function"
        summary="Converts a vector of values into a probability distribution."
        mastery="mastered"
        tags={[<CourseTag key="ml" course="ML" />, <DifficultyBadge key="d" difficulty="Easy" />]}
        stats={[{ label: 'Sources', value: '4' }, { label: 'Flashcards', value: '6' }]}
        className="w-72"
      />
    </div>
  </div>
);

export const KnowledgeGraphNodeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">KnowledgeGraphNode — for graph layouts</h2>
    <div className="flex flex-wrap gap-4">
      {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
        <KnowledgeGraphNode
          key={mastery}
          title={`${mastery} node`}
          mastery={mastery}
          sourceCount={5}
          timeEstimate="20 min"
          onClick={() => {}}
        />
      ))}
      <KnowledgeGraphNode
        title="Selected node"
        mastery="learning"
        sourceCount={8}
        selected
        timeEstimate="35 min"
      />
      <KnowledgeGraphNode
        title="Dimmed node"
        mastery="mastered"
        dimmed
        sourceCount={3}
      />
    </div>
  </div>
);

export const PrerequisiteCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PrerequisiteCard</h2>
    <div className="max-w-xs">
      <PrerequisiteCard
        title="Prerequisites for Backpropagation"
        items={[
          { title: 'Linear Algebra', mastery: 'mastered', done: true },
          { title: 'Calculus', mastery: 'mastered', done: true },
          { title: 'Chain Rule', mastery: 'learning', done: false },
          { title: 'Neural Networks Basics', mastery: 'weak', done: false },
          { title: 'Gradient Descent', mastery: 'unknown', done: false },
        ]}
      />
    </div>
  </div>
);

export const LearningStepCardExample = () => (
  <div className="p-10 space-y-4 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">LearningStepCard</h2>
    <div className="max-w-sm space-y-3">
      <LearningStepCard
        step={1}
        title="Read the introduction"
        description="Start with Chapter 1 of the ML Fundamentals textbook."
        status="done"
        estimatedTime="20 min"
      />
      <LearningStepCard
        step={2}
        title="Watch the lecture video"
        description="Khan Academy: Neural Networks explained visually."
        status="active"
        estimatedTime="45 min"
        actions={<SketchButton size="sm">Open</SketchButton>}
        onClick={() => {}}
      />
      <LearningStepCard
        step={3}
        title="Practice with exercises"
        description="Complete the 10 backpropagation exercises in the workbook."
        status="pending"
        estimatedTime="30 min"
      />
      <LearningStepCard
        step={4}
        title="Take the quiz"
        description="Test your understanding with 15 multiple-choice questions."
        status="pending"
        estimatedTime="15 min"
      />
    </div>
  </div>
);

export const QuizRecommendationExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">QuizRecommendation</h2>
    <div className="flex flex-wrap gap-4">
      <QuizRecommendation
        title="ML Fundamentals Check"
        questionCount={15}
        difficulty="Medium"
        badge={<DifficultyBadge difficulty="Medium" />}
        reason="You haven't reviewed this topic in 7 days."
        onStart={() => console.log('start quiz')}
        className="max-w-xs"
      />
      <QuizRecommendation
        title="Linear Algebra Deep Dive"
        questionCount={25}
        difficulty="Hard"
        badge={<DifficultyBadge difficulty="Hard" />}
        reason="You're ready to advance — mastery at 85%."
        onStart={() => {}}
        className="max-w-xs"
      />
    </div>
  </div>
);

export const StudyRecommendationExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StudyRecommendation — all activity types</h2>
    <div className="flex flex-wrap gap-4">
      {(['read', 'review', 'practice', 'watch'] as const).map(type => (
        <StudyRecommendation
          key={type}
          type={type}
          title={`${type.charAt(0).toUpperCase() + type.slice(1)}: Attention Mechanism`}
          source="Attention Is All You Need (2017)"
          estimatedTime="25 min"
          reason="Weak on this concept — review recommended."
          badge={<CourseTag course="ML" />}
          actionLabel={type === 'read' ? 'Open PDF' : type === 'watch' ? 'Watch Now' : 'Start'}
          onAction={() => {}}
          className="max-w-xs"
        />
      ))}
    </div>
  </div>
);

export const ConceptEdgeLabelExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ConceptEdgeLabel — relation types</h2>
    <div className="flex flex-wrap gap-3">
      {(['covers', 'requires', 'uses', 'related', 'introduces', 'prerequisite'] as const).map(rel => (
        <ConceptEdgeLabel key={rel} label={rel} relation={rel} />
      ))}
      <ConceptEdgeLabel label="Custom label" />
    </div>
  </div>
);

export const MasteryFilterGroupExample = () => {
  const [items, setItems] = useState([
    { level: 'all' as const, label: 'All', count: 42, active: true },
    { level: 'mastered' as const, label: 'Mastered', count: 17, active: false },
    { level: 'learning' as const, label: 'Learning', count: 15, active: false },
    { level: 'weak' as const, label: 'Weak', count: 7, active: false },
    { level: 'unknown' as const, label: 'Unknown', count: 3, active: false },
  ]);

  return (
    <div className="p-10 space-y-6 bg-[#f4f1ea]">
      <h2 className="font-serif text-xl font-bold">MasteryFilterGroup</h2>
      <div className="w-48 bg-white/60 rounded-xl p-3">
        <MasteryFilterGroup
          items={items}
          onChange={(level, active) =>
            setItems(prev => prev.map(i => i.level === level ? { ...i, active } : i))
          }
        />
      </div>
    </div>
  );
};
