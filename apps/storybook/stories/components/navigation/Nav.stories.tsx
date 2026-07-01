import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import { Nav } from '@paper-ui/components/navigation';
import { BookOpen, Brain, FileText, Settings, Zap, FolderIcon, Star, Clock } from 'lucide-react';

const meta = {
  title: 'Components/Navigation',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

export const SideNav = {
  render: () => (
    <Nav className="w-64 h-[560px]">
      <Nav.Label>Main</Nav.Label>
      <Nav.Item active icon={<BookOpen size={16} />}>
        Documents
        <Nav.Badge count={12} />
      </Nav.Item>
      <Nav.Item icon={<Brain size={16} />}>
        Flashcards
        <Nav.Badge count={8} tone="sage" />
      </Nav.Item>
      <Nav.Item icon={<Zap size={16} />}>
        Quizzes
        <Nav.Badge count={3} tone="ochre" />
      </Nav.Item>
      <Nav.Section />
      <Nav.Label>Library</Nav.Label>
      <Nav.Item icon={<FileText size={16} />}>Notes</Nav.Item>
      <Nav.Item icon={<FolderIcon size={16} />}>Courses</Nav.Item>
      <Nav.Item icon={<Star size={16} />}>Bookmarks</Nav.Item>
      <Nav.Section />
      <Nav.Label>Settings</Nav.Label>
      <Nav.Item icon={<Settings size={16} />}>Preferences</Nav.Item>
    </Nav>
  ),
};

export const NavWithGroups = {
  render: () => {
    const [active, setActive] = useState('chemistry');
    return (
      <Nav className="w-64 h-[560px]">
        <Nav.Label>Study Materials</Nav.Label>
        <Nav.Group title="Science" defaultOpen>
          <Nav.Item
            active={active === 'biology'}
            onClick={() => setActive('biology')}
            icon={<FileText size={16} />}
          >
            Biology
          </Nav.Item>
          <Nav.Item
            active={active === 'chemistry'}
            onClick={() => setActive('chemistry')}
            icon={<FileText size={16} />}
          >
            Chemistry
            <Nav.Badge count={5} tone="sky" />
          </Nav.Item>
        </Nav.Group>
        <Nav.Group title="Humanities">
          <Nav.Item icon={<FileText size={16} />}>History</Nav.Item>
          <Nav.Item icon={<FileText size={16} />}>Philosophy</Nav.Item>
        </Nav.Group>
        <Nav.Section />
        <Nav.Label>Practice</Nav.Label>
        <Nav.Item icon={<Brain size={16} />}>Flashcards</Nav.Item>
        <Nav.Item icon={<Zap size={16} />}>Quiz Mode</Nav.Item>
      </Nav>
    );
  },
};

export const NavWithFooter = {
  render: () => (
    <Nav className="w-64 h-[560px]">
      <div className="flex-1">
        <Nav.Label>Workspace</Nav.Label>
        <Nav.Item active icon={<FileText size={16} />}>All Notes</Nav.Item>
        <Nav.Item icon={<FolderIcon size={16} />}>Projects</Nav.Item>
        <Nav.Item icon={<Star size={16} />}>Starred</Nav.Item>
        <Nav.Item icon={<Clock size={16} />}>Recent</Nav.Item>
      </div>
      <Nav.Footer>
        <div className="flex items-center gap-2 font-kalam text-[13px] text-ink">
          <span className="h-7 w-7 rounded-full bg-ochre/20 flex items-center justify-center text-[11px] font-architect font-bold text-ochre">
            SK
          </span>
          <span>Saptanshu</span>
        </div>
        <div className="mt-1 pl-9">
          <Nav.Item icon={<Settings size={13} />} className="!px-0 !py-1 text-[12px]">
            Settings
          </Nav.Item>
        </div>
      </Nav.Footer>
    </Nav>
  ),
};

export const NavSections = {
  render: () => (
    <Nav className="w-64 h-[560px]">
      <Nav.Section>
        <Nav.Label>Getting Started</Nav.Label>
        <Nav.Item icon={<BookOpen size={16} />}>Introduction</Nav.Item>
        <Nav.Item icon={<Zap size={16} />}>Quick Start</Nav.Item>
      </Nav.Section>
      <Nav.Section>
        <Nav.Label>Core Concepts</Nav.Label>
        <Nav.Item icon={<Brain size={16} />}>RAG Pipeline</Nav.Item>
        <Nav.Item icon={<FileText size={16} />}>Document Ingestion</Nav.Item>
        <Nav.Item icon={<FolderIcon size={16} />}>Vector Search</Nav.Item>
      </Nav.Section>
      <Nav.Section>
        <Nav.Label>Advanced</Nav.Label>
        <Nav.Item icon={<Settings size={16} />}>Model Routing</Nav.Item>
        <Nav.Item icon={<Star size={16} />}>Custom Prompts</Nav.Item>
      </Nav.Section>
    </Nav>
  ),
};

export const DoodleNavGallery = {
  render: () => (
    <div className="bg-[#f4f1ea] p-10 min-h-[640px] flex items-start justify-center gap-8">
      <Nav className="w-72 h-[600px]">
        <div className="relative px-4 pt-5 pb-3">
          <div className="font-caveat text-2xl font-bold text-ink">ScholarCLI</div>
          <div className="font-architect text-[10px] uppercase tracking-[0.14em] text-ink-muted mt-0.5">
            Study Assistant
          </div>
        </div>
        <Nav.Section>
          <Nav.Label>Learn</Nav.Label>
          <Nav.Item active icon={<BookOpen size={16} />}>
            Documents
            <Nav.Badge count={24} />
          </Nav.Item>
          <Nav.Item icon={<Brain size={16} />}>
            Flash Cards
            <Nav.Badge count={156} tone="sage" />
          </Nav.Item>
          <Nav.Item icon={<Zap size={16} />}>
            Quiz Mode
            <Nav.Badge count={8} tone="ochre" />
          </Nav.Item>
        </Nav.Section>
        <Nav.Section>
          <Nav.Label>Review</Nav.Label>
          <Nav.Item icon={<Star size={16} />}>Bookmarks</Nav.Item>
          <Nav.Item icon={<Clock size={16} />}>History</Nav.Item>
        </Nav.Section>
        <Nav.Group title="Courses" defaultOpen>
          <Nav.Item icon={<FolderIcon size={16} />}>Operating Systems</Nav.Item>
          <Nav.Item icon={<FolderIcon size={16} />}>Machine Learning</Nav.Item>
          <Nav.Item icon={<FolderIcon size={16} />}>Data Structures</Nav.Item>
        </Nav.Group>
        <div className="flex-1" />
        <Nav.Footer>
          <div className="flex items-center gap-2.5 font-kalam text-[13px] text-ink">
            <span className="h-7 w-7 rounded-full bg-sage/20 flex items-center justify-center text-[10px] font-architect font-bold text-sage">
              U
            </span>
            <span>User</span>
          </div>
          <Nav.Item icon={<Settings size={13} />} className="!px-0 !py-1 text-[12px]">
            Preferences
          </Nav.Item>
        </Nav.Footer>
      </Nav>
    </div>
  ),
};
