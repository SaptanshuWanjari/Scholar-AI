import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  PaperBadge,
  DifficultyBadge,
  StatusBadge,
  PriorityBadge,
  CourseTag,
  TypeTag,
  CategoryTag,
  Pill,
} from '@paper-ui/components/badges';
import { Star } from 'lucide-react';

const meta = {
  title: 'Components/Badges',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const PaperBadgeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PaperBadge — all tones</h2>
    <div className="flex flex-wrap gap-3">
      <PaperBadge tone="ink">Ink</PaperBadge>
      <PaperBadge tone="sage">Sage</PaperBadge>
      <PaperBadge tone="ochre">Ochre</PaperBadge>
      <PaperBadge tone="sky">Sky</PaperBadge>
      <PaperBadge tone="lavender">Lavender</PaperBadge>
      <PaperBadge tone="brick">Brick</PaperBadge>
    </div>
  </div>
);

export const DifficultyBadgeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">DifficultyBadge</h2>
    <div className="flex gap-4 flex-wrap">
      <DifficultyBadge difficulty="Easy" />
      <DifficultyBadge difficulty="Medium" />
      <DifficultyBadge difficulty="Hard" />
    </div>
    <h3 className="font-serif text-base font-bold mt-4">With dot indicator</h3>
    <div className="flex gap-4 flex-wrap">
      <DifficultyBadge difficulty="Easy" showIcon />
      <DifficultyBadge difficulty="Medium" showIcon />
      <DifficultyBadge difficulty="Hard" showIcon />
    </div>
  </div>
);

export const StatusBadgeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">StatusBadge — document states</h2>
    <div className="flex gap-4 flex-wrap">
      <StatusBadge status="indexed" />
      <StatusBadge status="processing" />
      <StatusBadge status="failed" />
    </div>
  </div>
);

export const PriorityBadgeExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">PriorityBadge</h2>
    <div className="flex gap-4 flex-wrap">
      <PriorityBadge priority="low" />
      <PriorityBadge priority="medium" />
      <PriorityBadge priority="high" />
      <PriorityBadge priority="critical" />
    </div>
  </div>
);

export const TagsExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">CourseTag, TypeTag, CategoryTag</h2>
    <div className="flex flex-wrap gap-3">
      <CourseTag course="Machine Learning" />
      <CourseTag course="Linear Algebra" tone="sky" />
      <TypeTag type="pdf" />
      <TypeTag type="md" />
      <TypeTag type="docx" />
      <CategoryTag category="Science" />
      <CategoryTag category="History" tone="lavender" />
    </div>
  </div>
);

export const PillExample = () => (
  <div className="p-10 space-y-6 bg-[#f4f1ea]">
    <h2 className="font-serif text-xl font-bold">Pill — with dots, icons, and remove</h2>
    <div className="flex flex-wrap gap-3">
      <Pill tone="sage" dot="#3f7a4e">Mastered</Pill>
      <Pill tone="ochre" dot="#b07a2e">Learning</Pill>
      <Pill tone="brick" dot="#a3544a">Weak</Pill>
      <Pill tone="sky" icon={<Star size={10} />}>Starred</Pill>
      <Pill tone="lavender" onRemove={() => {}}>Removable</Pill>
      <Pill tone="ink">Plain</Pill>
    </div>
  </div>
);
