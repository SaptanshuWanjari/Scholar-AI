import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  SketchProgress,
  CircularProgress,
  StepProgress,
  LearningProgress,
  StageProgress,
  TimelineProgress,
} from '@paper-ui/components/progress';

const meta = {
  title: 'Components/Progress',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const SketchProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SketchProgress — values & colors</h2>
    <div className="max-w-md space-y-5">
      {[
        { value: 0, color: '#7fa37b', label: '0%' },
        { value: 25, color: '#b07a2e', label: '25%' },
        { value: 50, color: '#4a6f91', label: '50%' },
        { value: 75, color: '#6f63a3', label: '75%' },
        { value: 100, color: '#7fa37b', label: '100%' },
      ].map(({ value, color, label }) => (
        <div key={value} className="space-y-1">
          <div className="flex justify-between">
            <span className="font-architect text-sm text-ink-muted">{label}</span>
          </div>
          <SketchProgress value={value} color={color} />
        </div>
      ))}

      <div className="space-y-1">
        <span className="font-architect text-sm text-ink-muted">Tall (height=24)</span>
        <SketchProgress value={65} height={24} />
      </div>
    </div>
  </div>
);

export const CircularProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">CircularProgress</h2>
    <div className="flex flex-wrap gap-8 items-end">
      {[
        { value: 0, color: '#9c9484', size: 60 },
        { value: 30, color: '#a3544a', size: 70 },
        { value: 60, color: '#b07a2e', size: 80 },
        { value: 85, color: '#4a6f91', size: 80 },
        { value: 100, color: '#7fa37b', size: 80 },
      ].map(({ value, color, size }) => (
        <div key={value} className="flex flex-col items-center gap-2">
          <CircularProgress value={value} size={size} color={color} label={`${value}%`} />
          <span className="font-mono text-xs text-gray-500">{value}%</span>
        </div>
      ))}
    </div>

    <div>
      <h3 className="font-serif text-base font-bold mt-6 mb-3">Various sizes</h3>
      <div className="flex gap-8 items-end">
        {[48, 64, 96, 120].map(size => (
          <CircularProgress key={size} value={72} size={size} label={`${size}px`} />
        ))}
      </div>
    </div>
  </div>
);

export const StepProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StepProgress</h2>

    <div className="space-y-8 max-w-lg">
      <div>
        <p className="font-architect text-sm text-ink-muted mb-3">Step 0 (not started)</p>
        <StepProgress steps={['Read', 'Recall', 'Review', 'Repeat']} current={0} />
      </div>
      <div>
        <p className="font-architect text-sm text-ink-muted mb-3">Step 2 (in progress)</p>
        <StepProgress steps={['Read', 'Recall', 'Review', 'Repeat']} current={2} />
      </div>
      <div>
        <p className="font-architect text-sm text-ink-muted mb-3">All done</p>
        <StepProgress steps={['Read', 'Recall', 'Review', 'Repeat']} current={4} />
      </div>
    </div>
  </div>
);

export const LearningProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">LearningProgress</h2>
    <div className="max-w-sm space-y-6">
      <LearningProgress
        label="Machine Learning"
        sublabel="Neural Networks chapter"
        value={68}
        done="17 concepts"
        total="25 concepts"
      />
      <LearningProgress
        label="Linear Algebra"
        value={100}
        done="32 concepts"
        total="32 concepts"
        color="#7fa37b"
      />
      <LearningProgress
        label="Data Structures"
        value={20}
        color="#a3544a"
        done="4 topics"
        total="20 topics"
      />
    </div>
  </div>
);

export const StageProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StageProgress</h2>
    <div className="max-w-sm space-y-6">
      <StageProgress title="Introduction to ML" value={80} sublabel="4 / 5 modules" />
      <StageProgress title="Neural Networks" value={45} color="#4a6f91" sublabel="3 / 7 chapters" />
      <StageProgress title="Backpropagation" value={10} color="#a3544a" sublabel="1 / 10 exercises" />
      <StageProgress title="Complete" value={100} color="#7fa37b" sublabel="All done!" />
    </div>
  </div>
);

export const TimelineProgressExample = () => (
  <div className="p-10 space-y-8 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">TimelineProgress</h2>
    <div className="max-w-xs">
      <TimelineProgress
        stages={[
          { label: 'Read introduction', sublabel: 'Chapter 1', status: 'done', percent: 100 },
          { label: 'Watch lecture', sublabel: '45 min', status: 'done', percent: 100 },
          { label: 'Practice problems', sublabel: '10 exercises', status: 'active', percent: 40 },
          { label: 'Take quiz', sublabel: '15 questions', status: 'pending' },
          { label: 'Review flashcards', sublabel: 'Spaced repetition', status: 'pending' },
        ]}
      />
    </div>
  </div>
);
