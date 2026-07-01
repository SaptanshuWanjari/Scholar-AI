import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperSheetCard, MarkerHighlight } from '@paper-ui/core'
import { Tape } from '../../../../paper-ui/src/components/decorations'

const meta: Meta<typeof PaperSheetCard> = {
  title: 'Core/PaperSheetCard',
  component: PaperSheetCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Paper Sheet Card

Renders a ruled notebook-page surface using a single hand-drawn SVG. Features horizontal ruled lines, a subtle bottom-right fold with drop shadow, and an optional hole-punch detail. The SVG auto-scales to fill its container — size it by setting the parent's width.

Ideal for note-taking interfaces, journal entries, document previews, and any UI that wants ruled-paper character.

### Import
\`\`\`tsx
import { PaperSheetCard } from '@paper-ui/core'
\`\`\``,
      },
    },
  },
  argTypes: {
    title: {
      description: 'Optional title rendered in the top band of the ruled sheet.',
      control: 'text',
    },
    children: {
      description: 'Content rendered below the title band.',
    },
    className: {
      description: 'Additional CSS classes on the outer wrapper.',
    },
  },
}

export default meta
type Story = StoryObj<typeof PaperSheetCard>

export const Default: Story = {
  parameters: { docs: { description: { story: 'A titled paper sheet card with ruled lines, fold, and content in \`font-kalam\` handwriting font.' } } },
  render: () => (
    <div style={{ width: 320 }}>
      <PaperSheetCard title="CHAPTER 1">
        <p className="font-kalam text-sm text-ink leading-relaxed">
          The paper-sheet SVG scales to fill this container. Its hand-drawn outline and
          bottom-right fold are computed from the measured width and height.
        </p>
      </PaperSheetCard>
    </div>
  ),
}

export const NoTitle: Story = {
  parameters: { docs: { description: { story: 'Omitting the \`title\` prop removes the title band — content fills the full padded area.' } } },
  render: () => (
    <div style={{ width: 280 }}>
      <PaperSheetCard>
        <p className="font-kalam text-sm text-ink leading-relaxed">
          Without a title prop the content fills the full padding area.
        </p>
      </PaperSheetCard>
    </div>
  ),
}

export const Narrow: Story = {
  parameters: { docs: { description: { story: 'The SVG fold and ruled lines adapt automatically as the container width changes. Works well in sidebars and narrow panels.' } } },
  render: () => (
    <div style={{ width: 180 }}>
      <PaperSheetCard title="NOTES">
        <p className="font-kalam text-xs text-ink leading-relaxed">
          Same component at a narrower container. The SVG fold adapts automatically.
        </p>
      </PaperSheetCard>
    </div>
  ),
}

export const WithDecorations: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

PaperSheetCard layers with tape, push-pin, and marker decorations.

### Design Guidelines
- **When to use:** Note-taking interfaces, journal views, document previews, notebook-style layouts
- **When not to use:** Data tables (lines conflict), dark backgrounds (paper needs light surfaces), very narrow cards (<150px)
- **Best practice:** Parent must have defined width, use \`font-kalam\` or \`font-architect\` for content, keep content concise

### Related Components
- **PaperCard** — General-purpose paper surface
- **PaperSheetBorder** — Underlying ruled-paper edge primitive
- **Paper** — Extended paper surface with texture layer`,
      },
    },
  },
  render: () => (
    <div className="space-y-6">
      <div className="relative" style={{ width: 300 }}>
        <div className="absolute -top-3 -right-2 z-20 rotate-12">
          <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="8" r="5" stroke="#c9954f" strokeWidth="1.8" fill="none"/><line x1="12" y1="13" x2="12" y2="20" stroke="#c9954f" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div className="absolute -top-1 left-3 z-20">
          <Tape corner="top-left" width={30} rotate={-18} />
        </div>
        <PaperSheetCard title="PINNED NOTE">
          <p className="font-kalam text-sm text-ink">
            A note held in place with tape and a <MarkerHighlight color="#f6e27a">push-pin</MarkerHighlight> doodle.
          </p>
        </PaperSheetCard>
      </div>
    </div>
  ),
}

export const MultipleSheets: Story = {
  parameters: { docs: { description: { story: 'Multiple paper sheets stacked together create a notebook-binder effect. Vary widths slightly for a natural, imperfect look.' } } },
  render: () => (
    <div className="space-y-1">
      {[300, 290, 310, 295].map((w, i) => (
        <div key={i} style={{ width: w }}>
          <PaperSheetCard title={i === 0 ? 'Page 1' : undefined}>
            {i === 0 && (
              <p className="font-kalam text-sm text-ink leading-relaxed">
                Top sheet with title. Sheets beneath it peek out, creating a notebook stack effect.
              </p>
            )}
          </PaperSheetCard>
        </div>
      ))}
    </div>
  ),
}
