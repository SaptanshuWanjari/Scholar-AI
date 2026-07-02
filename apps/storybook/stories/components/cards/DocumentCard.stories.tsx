import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DocumentCard } from '@paper-ui/components/cards'

const meta: Meta<typeof DocumentCard> = {
  title: 'Components/Cards/DocumentCard',
  component: DocumentCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof DocumentCard>

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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
  ),
}

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
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
    </div>
  ),
}
