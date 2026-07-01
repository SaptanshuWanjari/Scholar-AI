import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  CourseCard,
  DocumentCard,
  NotebookCard,
  PinnedCard,
  StickyNoteCard,
  MetricCard,
  RecommendationCard,
  SessionCard,
  StatsCard,
  SummaryCard,
  PluginCard,
  ActionCard,
  ArtifactCard,
  ConceptCard,
  LearningPathCard,
} from '@paper-ui/components/cards';
import { Brain, BookOpen, FileText, Zap, Globe, Puzzle } from 'lucide-react';
import { DifficultyBadge, CourseTag } from '@paper-ui/components/badges';
import { SketchButton } from '@paper-ui/components/buttons';

const meta = {
  title: 'Components/Cards',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const CourseCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">CourseCard</h2>
    <div className="flex flex-wrap gap-5">
      <CourseCard
        title="Machine Learning"
        subject="AI & Data Science"
        icon={<Brain size={20} strokeWidth={1.6} />}
        tone="lavender"
        progress={68}
        documentCount={24}
        lastStudied="2h ago"
        tags={['Neural Networks', 'Optimization', 'Backprop']}
        onContinue={() => {}}
        onClick={() => {}}
        className="w-64"
      />
      <CourseCard
        title="Linear Algebra"
        subject="Mathematics"
        tone="sky"
        progress={100}
        documentCount={12}
        lastStudied="Yesterday"
        tags={['Vectors', 'Matrices', 'Eigenvectors']}
        className="w-64"
      />
      <CourseCard
        title="Data Structures"
        subject="Computer Science"
        icon={<Zap size={20} strokeWidth={1.6} />}
        tone="ochre"
        progress={20}
        documentCount={8}
        tags={['Trees', 'Graphs', 'Heaps']}
        onContinue={() => {}}
        className="w-64"
      />
    </div>
  </div>
);

export const DocumentCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">DocumentCard</h2>
    <div className="flex flex-wrap gap-5">
      <DocumentCard
        title="Attention Is All You Need"
        course="Machine Learning"
        type="pdf"
        pageCount={12}
        fileSize="2.4 MB"
        dateAdded="Jun 28"
        chunkCount={48}
        tags={['Transformers', 'Attention', 'NLP']}
        onOpen={() => {}}
        onDelete={() => {}}
        className="w-64"
      />
      <DocumentCard
        title="Linear Algebra Notes"
        course="Mathematics"
        type="md"
        fileSize="48 KB"
        dateAdded="Jun 25"
        className="w-64"
      />
      <DocumentCard
        title="Calculus Textbook Chapter 5"
        course="Mathematics"
        type="pdf"
        pageCount={32}
        fileSize="8.1 MB"
        tags={['Integration', 'Derivatives']}
        className="w-64"
      />
    </div>
  </div>
);

export const MetricCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">MetricCard — large stat tiles</h2>
    <div className="flex flex-wrap gap-5">
      <MetricCard
        label="Concepts Mastered"
        value={138}
        unit="concepts"
        trend={12}
        trendLabel="+12 this week"
        icon={<Brain size={20} />}
        tone="lavender"
        className="w-52"
      />
      <MetricCard
        label="Study Time"
        value="12h"
        unit="this week"
        trend={3}
        trendLabel="+3h vs last week"
        icon={<BookOpen size={20} />}
        tone="ochre"
        className="w-52"
      />
      <MetricCard
        label="Documents"
        value={24}
        unit="indexed"
        trend={0}
        trendLabel="No change"
        icon={<FileText size={20} />}
        tone="sky"
        className="w-52"
      />
      <MetricCard
        label="Quiz Score"
        value="87%"
        description="Average across 12 quizzes"
        trend={-2}
        trendLabel="-2% vs last week"
        tone="brick"
        className="w-52"
      />
    </div>
  </div>
);

export const SessionCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SessionCard</h2>
    <div className="max-w-sm">
      <SessionCard
        title="Recent Sessions"
        sessions={[
          { text: 'Machine Learning Fundamentals', subtext: 'Chapter 4 — Backpropagation', duration: '45 min', ago: '2h ago' },
          { text: 'Linear Algebra Review', subtext: 'Eigenvectors & eigenvalues', duration: '30 min', ago: 'Yesterday' },
          { text: 'Quick Flashcard Drill', duration: '12 min', ago: '2 days ago' },
        ]}
        onViewAll={() => {}}
      />
    </div>
  </div>
);

export const StatsCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StatsCard</h2>
    <div className="max-w-sm">
      <StatsCard
        title="This Week"
        stats={[
          { icon: <BookOpen size={16} />, tone: 'sage', label: 'Documents', sublabel: 'Indexed', value: '24' },
          { icon: <Brain size={16} />, tone: 'lavender', label: 'Concepts', sublabel: 'Mastered', value: '138' },
          { icon: <Zap size={16} />, tone: 'ochre', label: 'Study Time', value: '12h' },
        ]}
      />
    </div>
  </div>
);

export const StickyNoteCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StickyNoteCard — pastel colors</h2>
    <div className="flex flex-wrap gap-8 items-start pt-4">
      {(['yellow', 'pink', 'blue', 'green', 'orange', 'purple'] as const).map((color, i) => (
        <StickyNoteCard
          key={color}
          color={color}
          title="Quick note"
          rotate={i % 2 === 0 ? -2 : 2}
          pin={i % 3 === 0 ? 'push-pin' : i % 3 === 1 ? 'tape' : 'none'}
          className="w-44"
        >
          <p className="font-kalam text-sm mt-2">Review {color} topics before the exam!</p>
        </StickyNoteCard>
      ))}
    </div>
  </div>
);

export const PinnedCardExample = () => (
  <div className="p-10 space-y-10 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PinnedCard</h2>
    <div className="flex flex-wrap gap-8 items-start pt-6">
      <PinnedCard title="Important Note" pinStyle="push-pin" rotate={-2} className="w-56">
        <p className="font-kalam text-sm text-ink-muted mt-2">
          Remember to review backpropagation before the exam tomorrow.
        </p>
      </PinnedCard>
      <PinnedCard title="To-do" pinStyle="tape" rotate={1.5} className="w-56">
        <ul className="font-kalam text-sm text-ink-muted mt-2 space-y-1">
          <li>✓ Read Chapter 4</li>
          <li>□ Watch lecture</li>
          <li>□ Practice problems</li>
        </ul>
      </PinnedCard>
    </div>
  </div>
);

export const RecommendationCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">RecommendationCard</h2>
    <div className="flex flex-wrap gap-5">
      <RecommendationCard
        title="Review Backpropagation"
        description="You haven't practiced this concept in 14 days. A quick review will strengthen retention."
        reason="Based on your spaced repetition schedule"
        actionLabel="Start Review"
        icon={<Brain size={20} />}
        tone="lavender"
        onAction={() => {}}
        onDismiss={() => {}}
        className="max-w-xs"
      />
      <RecommendationCard
        title="Try the ML Quiz"
        description="You've mastered 85% of the course material — you're ready for a challenge."
        reason="AI-generated based on your progress"
        actionLabel="Take Quiz"
        icon={<Zap size={20} />}
        tone="ochre"
        onAction={() => {}}
        className="max-w-xs"
      />
    </div>
  </div>
);

export const SummaryCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">SummaryCard</h2>
    <div className="flex flex-wrap gap-5">
      <SummaryCard
        title="Attention Mechanism"
        summary="The attention mechanism allows a model to focus on different parts of the input sequence when producing each output token. It computes a weighted sum of value vectors, where weights are determined by the similarity between a query and a set of keys."
        source="Vaswani et al., 2017"
        sourceType="document"
        tags={['Transformers', 'NLP', 'Deep Learning']}
        tone="sky"
        highlightTitle
        onExpand={() => {}}
        className="max-w-xs"
      />
      <SummaryCard
        title="Gradient Descent Overview"
        summary="An optimization algorithm that iteratively adjusts parameters by moving in the direction opposite to the gradient of the loss function."
        sourceType="web"
        tags={['Optimization', 'ML']}
        tone="sage"
        className="max-w-xs"
      />
    </div>
  </div>
);

export const PluginCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PluginCard</h2>
    <div className="flex flex-wrap gap-5">
      <PluginCard
        name="Anki Sync"
        description="Export your flashcards directly to your Anki deck via the AnkiConnect API."
        version="1.2.0"
        author="community"
        icon={<Puzzle size={20} />}
        tone="sage"
        enabled={true}
        onToggle={() => {}}
        className="w-72"
      />
      <PluginCard
        name="AI Tutor"
        description="Get on-demand explanations for any concept using GPT-4."
        version="0.9.1"
        icon={<Brain size={20} />}
        tone="lavender"
        enabled={false}
        badge="Beta"
        onToggle={() => {}}
        className="w-72"
      />
      <PluginCard
        name="PDF Viewer"
        description="Rich inline PDF annotations with highlight sync."
        icon={<FileText size={20} />}
        tone="brick"
        comingSoon
        className="w-72"
      />
    </div>
  </div>
);

export const ArtifactCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ArtifactCard</h2>
    <div className="flex flex-wrap gap-5">
      <ArtifactCard
        title="Backpropagation Summary"
        type="summary"
        course="Machine Learning"
        count={320}
        countUnit="words"
        createdAt="Jun 30"
        onOpen={() => {}}
        className="w-64"
      />
      <ArtifactCard
        title="Eigenvectors Flashcards"
        type="flashcard"
        course="Linear Algebra"
        count={32}
        countUnit="cards"
        createdAt="Jun 28"
        onOpen={() => {}}
        className="w-64"
      />
      <ArtifactCard
        title="ML Fundamentals Quiz"
        type="quiz"
        course="Machine Learning"
        count={15}
        countUnit="questions"
        createdAt="Jun 25"
        className="w-64"
      />
      <ArtifactCard
        title="Lecture Notes"
        type="notes"
        course="Data Structures"
        createdAt="Jun 20"
        onOpen={() => {}}
        className="w-64"
      />
    </div>
  </div>
);

export const ConceptCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ConceptCard</h2>
    <div className="flex flex-wrap gap-5">
      {(['mastered', 'learning', 'weak', 'unknown'] as const).map(mastery => (
        <ConceptCard
          key={mastery}
          title="Gradient Descent"
          description="Optimization algorithm that moves in the direction of the negative gradient to minimize a loss function."
          mastery={mastery}
          sourceCount={8}
          flashcardCount={12}
          badge={<DifficultyBadge difficulty="Medium" />}
          onStudy={() => {}}
          className="w-60"
        />
      ))}
    </div>
  </div>
);

export const LearningPathCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">LearningPathCard</h2>
    <div className="max-w-xs">
      <LearningPathCard
        title="Deep Learning Foundations"
        description="A structured path from linear algebra to neural networks."
        progress={40}
        steps={[
          { title: 'Linear Algebra Basics', status: 'done', estimatedTime: '3h' },
          { title: 'Calculus & Optimization', status: 'done', estimatedTime: '4h' },
          { title: 'Neural Network Intro', status: 'active', estimatedTime: '5h' },
          { title: 'Backpropagation', status: 'pending', estimatedTime: '4h' },
          { title: 'CNNs & RNNs', status: 'pending', estimatedTime: '6h' },
        ]}
        onContinue={() => {}}
      />
    </div>
  </div>
);

export const ActionCardExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">ActionCard — CTA tiles</h2>
    <div className="flex flex-wrap gap-5">
      <ActionCard
        title="Upload a Document"
        description="Add a PDF, Markdown, or text file to start studying."
        icon={<FileText size={24} />}
        tone="sky"
        onAction={() => {}}
        actionLabel="Upload Now"
        className="w-56"
      />
      <ActionCard
        title="Start a Quiz"
        description="Test your knowledge with AI-generated questions."
        icon={<Zap size={24} />}
        tone="ochre"
        onAction={() => {}}
        actionLabel="Start Quiz"
        className="w-56"
      />
      <ActionCard
        title="Explore Web Sources"
        description="Let the AI find and summarize relevant articles."
        icon={<Globe size={24} />}
        tone="lavender"
        onAction={() => {}}
        actionLabel="Explore"
        className="w-56"
      />
    </div>
  </div>
);
