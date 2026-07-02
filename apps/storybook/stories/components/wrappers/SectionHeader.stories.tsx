import type { Meta, StoryObj } from '@storybook/react-vite'
import { SectionHeader, SectionLabel, PaperCard } from '@paper-ui/core'
import { SketchButton } from '../../../../paper-ui/src/components/buttons'
import { Search } from 'lucide-react'

const meta: Meta<typeof SectionHeader> = {
  title: 'Components/Wrappers/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Section Header

A handwritten section title with optional marker-highlight underline and an action slot. Compound layout: title on the left, action on the right, separated by a flex container. The marker underline is an SVG sweep that overshoots slightly for a natural highlighter feel.

**SectionLabel** is a standalone supporting label — smaller, italic, muted — for chapter counters, breadcrumb snippets, and metadata.

### Import
\`\`\`tsx
import { SectionHeader, SectionLabel } from '@paper-ui/core'
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      description: 'The section title text. Rendered in font-architect.',
      control: 'text',
    },
    marker: {
      description: 'Show a MarkerHighlight underline beneath the title.',
      table: { defaultValue: { summary: 'false' } },
    },
    markerColor: {
      description: 'Color of the marker sweep (CSS color string).',
      control: 'color',
      table: { defaultValue: { summary: '#f6e27a' } },
    },
    action: {
      description: 'Optional action element on the right — button, link, badge, or icon.',
    },
    className: {
      description: 'Additional CSS classes on the outer flex container.',
    },
  },
}

export default meta
type Story = StoryObj<typeof SectionHeader>

export const Default: Story = {
  parameters: { docs: { description: { story: 'A simple section title with no action or marker. Clean, minimal, ideal for lower-priority sections.' } } },
  render: () => (
    <div className="w-80">
      <SectionHeader title="Recent Notes" />
    </div>
  ),
}

export const WithAction: Story = {
  parameters: { docs: { description: { story: 'Title with a trailing action link or button. Common patterns: "View all →", badge counts, filter controls.' } } },
  render: () => (
    <div className="w-80">
      <SectionHeader
        title="Recent Notes"
        action={
          <button className="font-architect text-xs text-ink-muted uppercase tracking-widest hover:text-ink">
            View all →
          </button>
        }
      />
    </div>
  ),
}

export const WithMarker: Story = {
  parameters: { docs: { description: { story: 'Title with marker underline for extra emphasis. Custom \`markerColor\` lets you match section tone.' } } },
  render: () => (
    <div className="w-80">
      <SectionHeader
        title="Highlighted Section"
        marker
        markerColor="#f6e27a"
        action={<span className="font-architect text-xs text-ink-muted">3 items</span>}
      />
    </div>
  ),
}

export const LabelStandalone: Story = {
  parameters: { docs: { description: { story: '**SectionLabel** used independently — chapter labels, breadcrumb fragments, metadata spans. Smaller, italic, muted by default.' } } },
  render: () => (
    <div className="flex flex-col gap-2">
      <SectionLabel>Chapter label</SectionLabel>
      <SectionLabel className="text-ink">Darker label</SectionLabel>
    </div>
  ),
}

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

Section headers provide the title-action pattern within cards and sections.

### Design Guidelines
- **When to use:** Card/panel headers, section dividers in dashboards, list headers with counts, any repeating section needing title + action layout
- **When not to use:** As a page-level heading (use PaperH1/H2), for multi-line titles (single-line design), for breadcrumbs alone (use SectionLabel standalone)
- Use \`marker\` for the most important sections — not every section
- Keep action elements compact: links, small buttons, badges
- \`SectionLabel\` for supporting metadata: chapter numbers, breadcrumbs, counts
- Pair with PaperPanel for section groupings within a PaperCard

### Related Components
- **Headings** — Semantic heading components (H1–H6)
- **MarkerHighlight** — The underlying marker sweep primitive
- **PaperCard** — Paper surface that commonly hosts section headers`,
      },
    },
  },
  render: () => (
    <div className="space-y-4 max-w-md">
      <SectionLabel>Course / Machine Learning / Module 3</SectionLabel>
      <SectionHeader title="Backpropagation" marker markerColor="#b5f0b5" />

      <PaperCard className="p-4" shadow="sm">
        <SectionHeader
          title="Documents"
          marker
          markerColor="#f6e27a"
          action={
            <SketchButton size="sm">
              <Search size={12} />
              Search
            </SketchButton>
          }
        />
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-dashed border-[#d4cfc4]">
            <span className="font-kalam text-sm text-ink">Lecture 7 Notes.pdf</span>
            <span className="font-architect text-xs text-ink-muted">2 days ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dashed border-[#d4cfc4]">
            <span className="font-kalam text-sm text-ink">Problem Set 3.md</span>
            <span className="font-architect text-xs text-ink-muted">5 days ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="font-kalam text-sm text-ink">Research Paper.pdf</span>
            <span className="font-architect text-xs text-ink-muted">1 week ago</span>
          </div>
        </div>
      </PaperCard>

      <SectionHeader
        title="Active Courses"
        action={<span className="font-architect text-xs text-ink-muted">4 active</span>}
      />

      <SectionHeader
        title="Completed"
        marker
        markerColor="#b5f0b5"
        action={
          <button className="font-architect text-xs text-ink-muted uppercase tracking-widest hover:text-ink">
            View all →
          </button>
        }
      />
    </div>
  ),
}
