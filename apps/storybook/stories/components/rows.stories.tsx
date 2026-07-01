import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  StatRow,
  DocumentRow,
  SessionRow,
  CourseRow,
  ArtifactRow,
  FlashcardRow,
  QuizRow,
  TimelineRow,
  ConceptRow,
  SearchResultRow,
  PluginRow,
} from '@paper-ui/components/rows';
import { DifficultyBadge, StatusBadge, PriorityBadge, CourseTag, TypeTag, Pill } from '@paper-ui/components/badges';
import { PaperSwitch } from '@paper-ui/components/inputs';
import { SketchButton } from '@paper-ui/components/buttons';
import { BookOpen, Brain, Clock, FileText, Puzzle, Star, Trash2, Eye } from 'lucide-react';

const meta = {
  title: 'Components/Rows',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const StatRowExample = () => (
  <div className="p-10 space-y-4 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">StatRow</h2>
    <div className="max-w-sm bg-white/60 rounded-xl p-4 space-y-1">
      <StatRow icon={<BookOpen size={16} />} tone="sage" label="Documents" sublabel="Indexed" value="24" />
      <StatRow icon={<Brain size={16} />} tone="lavender" label="Concepts" sublabel="Mastered" value="138" />
      <StatRow icon={<Clock size={16} />} tone="ochre" label="Study Time" sublabel="This week" value="12h" />
      <StatRow icon={<Star size={16} />} tone="brick" label="Flashcards" sublabel="Due today" value="42" divider={false} />
    </div>
  </div>
);

export const DocumentRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">DocumentRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <DocumentRow
        title="Attention Is All You Need"
        meta="PDF · 2.4 MB · 12 pages"
        date="Jun 28"
        iconClass="text-[#a3544a]"
        starred
        onToggleStar={() => {}}
      />
      <DocumentRow
        title="Linear Algebra Notes"
        meta="Markdown · 48 KB"
        date="Jun 25"
        iconClass="text-[#3f7a4e]"
      />
      <DocumentRow
        title="Calculus Textbook Chapter 5"
        meta="PDF · 8.1 MB · 32 pages"
        date="Jun 20"
        iconClass="text-[#a3544a]"
        starred={false}
        onToggleStar={() => {}}
      />
    </div>
  </div>
);

export const SessionRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">SessionRow — recent sessions</h2>
    <div className="max-w-sm bg-white/60 rounded-xl p-4 space-y-3">
      <SessionRow text="Machine Learning Fundamentals" subtext="Chapter 4 — Backpropagation" duration="45 min" ago="2h ago" />
      <SessionRow text="Linear Algebra Review" subtext="Eigenvectors & eigenvalues" duration="30 min" ago="Yesterday" />
      <SessionRow text="Quick Flashcard Drill" duration="12 min" ago="2 days ago" />
    </div>
  </div>
);

export const CourseRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">CourseRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <CourseRow
        title="Machine Learning"
        initials="ML"
        color="#6f63a3"
        meta="24 docs · 138 concepts"
        badge={<CourseTag course="AI" />}
        isSelected
        onClick={() => {}}
      />
      <CourseRow
        title="Linear Algebra"
        initials="LA"
        color="#4a6f91"
        meta="12 docs · 64 concepts"
        badge={<CourseTag course="Math" tone="sky" />}
        onClick={() => {}}
      />
      <CourseRow
        title="Data Structures"
        initials="DS"
        color="#b07a2e"
        meta="8 docs · 40 concepts"
        badge={<CourseTag course="CS" tone="lavender" />}
        onClick={() => {}}
      />
    </div>
  </div>
);

export const ArtifactRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">ArtifactRow — generated artifacts</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <ArtifactRow
        icon={<FileText size={14} />}
        tone="lavender"
        title="Backpropagation Summary"
        badge={<CourseTag course="ML" />}
        date="2h ago"
        actions={<SketchButton size="sm">Open</SketchButton>}
      />
      <ArtifactRow
        icon={<BookOpen size={14} />}
        tone="sky"
        title="Eigenvectors Flashcards"
        badge={<CourseTag course="Math" tone="sky" />}
        date="Jun 28"
      />
      <ArtifactRow
        icon={<Brain size={14} />}
        tone="ochre"
        title="ML Fundamentals Quiz"
        badge={<CourseTag course="ML" tone="ochre" />}
        date="Jun 25"
        actions={<SketchButton size="sm">Retry</SketchButton>}
      />
    </div>
  </div>
);


export const FlashcardRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">FlashcardRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <FlashcardRow
        front="What is a gradient?"
        back="The vector of partial derivatives of a function."
        badge={<DifficultyBadge difficulty="Medium" />}
        meta="Due today"
        actions={<SketchButton size="sm"><Trash2 size={12} /></SketchButton>}
      />
      <FlashcardRow
        front="Define eigenvalue"
        back="λ such that Av = λv for non-zero vector v."
        badge={<DifficultyBadge difficulty="Hard" />}
        meta="Tomorrow"
      />
      <FlashcardRow
        front="What is the softmax function?"
        back="Normalizes a vector into a probability distribution."
        badge={<DifficultyBadge difficulty="Easy" />}
        meta="In 3 days"
      />
    </div>
  </div>
);

export const QuizRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">QuizRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <QuizRow
        title="ML Fundamentals Quiz"
        count="15 questions"
        badge={<DifficultyBadge difficulty="Medium" />}
        score="87%"
        onClick={() => {}}
        actions={<SketchButton size="sm">Retry</SketchButton>}
      />
      <QuizRow
        title="Linear Algebra Deep Dive"
        count="25 questions"
        badge={<DifficultyBadge difficulty="Hard" />}
        onClick={() => {}}
      />
      <QuizRow
        title="Quick Recall Check"
        count="5 questions"
        badge={<DifficultyBadge difficulty="Easy" />}
        score="100%"
      />
    </div>
  </div>
);

export const TimelineRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">TimelineRow</h2>
    <div className="max-w-xs bg-white/60 rounded-xl p-4">
      <TimelineRow label="Uploaded document" sublabel="2 days ago" status="done" />
      <TimelineRow label="Document indexed" sublabel="2 days ago" status="done" />
      <TimelineRow label="Concepts extracted" sublabel="1 day ago" status="active" />
      <TimelineRow label="Flashcards generated" sublabel="Pending…" status="pending" />
      <TimelineRow label="Study session created" sublabel="Pending…" status="pending" isLast />
    </div>
  </div>
);

export const ConceptRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">ConceptRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <ConceptRow
        title="Gradient Descent"
        description="Optimization algorithm that minimizes loss by following the negative gradient."
        indicator={<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3f7a4e]" />}
        badge={<DifficultyBadge difficulty="Medium" />}
        meta="12 sources"
        actions={<SketchButton size="sm">Review</SketchButton>}
      />
      <ConceptRow
        title="Backpropagation"
        description="Algorithm for computing gradients in neural networks layer by layer."
        indicator={<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#b07a2e]" />}
        badge={<DifficultyBadge difficulty="Hard" />}
        meta="8 sources"
      />
      <ConceptRow
        title="Softmax"
        description="Normalizes a vector of values into a probability distribution."
        indicator={<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#a3544a]" />}
        badge={<DifficultyBadge difficulty="Easy" />}
      />
    </div>
  </div>
);


export const SearchResultRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">SearchResultRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5">
      <SearchResultRow
        title="Attention Is All You Need"
        badge={<TypeTag type="pdf" />}
        snippet={<>…the <mark className="bg-yellow-200">attention</mark> mechanism allows the model to focus on relevant parts of the input…</>}
        onClick={() => {}}
      />
      <SearchResultRow
        title="Transformer Architecture Notes"
        badge={<TypeTag type="md" />}
        snippet="Self-attention computes a weighted sum of all positions in the sequence."
        onClick={() => {}}
      />
      <SearchResultRow
        title="ML Fundamentals Quiz"
        badge={<Pill tone="sky">Quiz</Pill>}
        onClick={() => {}}
      />
    </div>
  </div>
);

export const PluginRowExample = () => (
  <div className="p-10 space-y-3 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold mb-4">PluginRow</h2>
    <div className="max-w-lg bg-white/60 rounded-xl divide-y divide-black/5 p-2">
      <PluginRow
        icon={<Puzzle size={18} />}
        title="Anki Sync"
        description="Export flashcards directly to your Anki deck."
        meta={<Pill tone="sage">v1.2.0</Pill>}
        control={<PaperSwitch defaultChecked />}
      />
      <PluginRow
        icon={<Brain size={18} />}
        title="AI Tutor"
        description="Get AI-generated explanations for any concept."
        meta={<Pill tone="lavender">Built-in</Pill>}
        control={<PaperSwitch />}
      />
      <PluginRow
        icon={<FileText size={18} />}
        title="PDF Annotations"
        description="Highlight and annotate PDFs inline."
        meta={<Pill tone="ink">Beta</Pill>}
        control={<PaperSwitch defaultChecked />}
        expanded={
          <div className="mt-3 pl-12">
            <p className="font-architect text-xs text-ink-muted">Settings panel goes here.</p>
          </div>
        }
      />
    </div>
  </div>
);
