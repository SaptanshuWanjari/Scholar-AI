import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { PageTitle } from '@paper-ui/components/utility'

const meta: Meta<typeof PageTitle> = {
  title: 'Components/Utility/PageTitle',
  component: PageTitle,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof PageTitle>

export const Playground: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <PageTitle title="Documents" />
    </div>
  ),
}

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <PageTitle title="Documents" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] space-y-12 max-w-2xl">
      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">with eyebrow</p>
        <PageTitle title="Documents" eyebrow="Course Materials" />
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">with subtitle</p>
        <PageTitle
          title="Getting Started"
          subtitle="Learn the basics of the platform and set up your first project."
        />
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">with marker highlight</p>
        <PageTitle title="Highlights" marker markerColor="#f4e7d2" />
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">with breadcrumbs</p>
        <PageTitle
          title="Configuration"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'Configuration' },
          ]}
        />
      </section>

      <section>
        <p className="font-architect text-xs text-ink-muted/60 mb-2">with action button</p>
        <PageTitle
          title="Dashboard"
          action={
            <button className="font-architect text-xs px-3 py-1.5 rounded-md bg-[#e7efe4] text-[#3f7a4e] hover:bg-[#d5e8d2] transition-colors">
              + New Project
            </button>
          }
        />
      </section>
    </div>
  ),
}

export const Composition: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea] max-w-2xl">
      <PageTitle
        title="Getting Started"
        eyebrow="Course Materials"
        subtitle="Learn the fundamentals of computer architecture and memory management in modern operating systems."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: 'Operating Systems' },
        ]}
        marker
        markerColor="#f4e7d2"
        action={
          <button className="font-architect text-xs px-3 py-1.5 rounded-md bg-[#e7efe4] text-[#3f7a4e] hover:bg-[#d5e8d2] transition-colors">
            + New Note
          </button>
        }
      />
    </div>
  ),
}
