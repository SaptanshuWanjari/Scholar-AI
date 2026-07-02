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
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <PageTitle title="Documents" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] space-y-8 max-w-2xl">
      <PageTitle title="Documents" />
      <PageTitle title="Getting Started" eyebrow="Course Materials" />
      <PageTitle
        title="Settings"
        subtitle="Manage your account and preferences."
      />
      <PageTitle title="Dashboard" marker />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <PageTitle
        title="Projects"
        action={
          <button className="font-architect text-xs px-3 py-1.5 rounded-md bg-[#e7efe4] text-[#3f7a4e] hover:bg-[#d5e8d2]">
            + New Project
          </button>
        }
      />
    </div>
  ),
}

export const Full: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea] max-w-2xl">
      <PageTitle
        title="Getting Started"
        eyebrow="Course Materials"
        subtitle="Learn the fundamentals and set up your workspace."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: 'Getting Started' },
        ]}
        marker
        markerColor="#f4e7d2"
        action={
          <button className="font-architect text-xs px-3 py-1.5 rounded-md bg-[#e7efe4] text-[#3f7a4e] hover:bg-[#d5e8d2]">
            + New Note
          </button>
        }
      />
    </div>
  ),
}
