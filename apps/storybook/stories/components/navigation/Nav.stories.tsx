import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Nav } from '@paper-ui/components/navigation';
import { BookOpen, Brain, FileText, Settings, Zap, FolderIcon, Star } from 'lucide-react';

const meta = {
  title: 'Components/Navigation/Nav',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof Nav>;

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] inline-block">
      <Nav className="w-64 h-[480px]">
        <Nav.Section>
          <Nav.Label>Learn</Nav.Label>
          <Nav.Item active icon={<BookOpen size={16} />}>
            Documents
            <Nav.Badge count={24} />
          </Nav.Item>
          <Nav.Item icon={<Brain size={16} />}>
            Flashcards
            <Nav.Badge count={8} tone="sage" />
          </Nav.Item>
          <Nav.Item icon={<Zap size={16} />}>
            Quizzes
            <Nav.Badge count={3} tone="ochre" />
          </Nav.Item>
        </Nav.Section>
        <Nav.Section>
          <Nav.Label>Workspace</Nav.Label>
          <Nav.Item icon={<FileText size={16} />}>Notes</Nav.Item>
          <Nav.Item icon={<FolderIcon size={16} />}>Courses</Nav.Item>
          <Nav.Item icon={<Star size={16} />}>Bookmarks</Nav.Item>
        </Nav.Section>
        <Nav.Section>
          <Nav.Label>Settings</Nav.Label>
          <Nav.Item icon={<Settings size={16} />}>Preferences</Nav.Item>
        </Nav.Section>
      </Nav>
    </div>
  ),
};

export const WithCollapse: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] inline-block">
      <Nav className="w-64 h-[480px]">
        <Nav.Label>Study Materials</Nav.Label>
        <Nav.Group title="Science" defaultOpen>
          <Nav.Item icon={<FileText size={16} />}>Biology</Nav.Item>
          <Nav.Item icon={<FileText size={16} />}>Chemistry</Nav.Item>
          <Nav.Item icon={<FileText size={16} />}>Physics</Nav.Item>
        </Nav.Group>
        <Nav.Group title="Humanities">
          <Nav.Item icon={<FileText size={16} />}>History</Nav.Item>
          <Nav.Item icon={<FileText size={16} />}>Philosophy</Nav.Item>
        </Nav.Group>
        <Nav.Section>
          <Nav.Label>Actions</Nav.Label>
          <Nav.Item active icon={<Brain size={16} />}>
            Practice
          </Nav.Item>
          <Nav.Item icon={<Zap size={16} />}>Quick Quiz</Nav.Item>
        </Nav.Section>
      </Nav>
    </div>
  ),
};
