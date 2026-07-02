import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocumentCard } from '@paper-ui/components/cards'

const meta: Meta<typeof DocumentCard> = {
  title: 'Components/Cards/DocumentCard',
  component: DocumentCard,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DocumentCard>

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <DocumentCard
        title="Chapter 3 Lecture Notes"
        course="Operating Systems"
        type="pdf"
        pageCount={24}
        chunkCount={96}
        dateAdded="Today"
        className="w-64"
      />
    </div>
  ),
}

export const Interactive: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <DocumentCard
        title="Linear Algebra Textbook"
        course="Mathematics"
        type="pdf"
        pageCount={450}
        fileSize="12.5 MB"
        dateAdded="Yesterday"
        onOpen={() => alert('Document opened')}
        onDelete={() => alert('Deleted')}
        className="w-64"
      />
    </div>
  ),
}

export const AllTypes: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] flex gap-6 flex-wrap">
      <DocumentCard
        title="Research Paper"
        course="Machine Learning"
        type="pdf"
        pageCount={15}
        fileSize="2.4 MB"
        chunkCount={48}
        className="w-64"
      />
      <DocumentCard
        title="Study Guide"
        course="Physics"
        type="md"
        fileSize="48 KB"
        dateAdded="2 days ago"
        className="w-64"
      />
      <DocumentCard
        title="Textbook Chapter"
        course="Data Structures"
        type="txt"
        fileSize="156 KB"
        tags={['Algorithms', 'Trees']}
        className="w-64"
      />
    </div>
  ),
}
