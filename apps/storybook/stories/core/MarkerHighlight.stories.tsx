import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarkerHighlight, PaperH2 } from '@paper-ui/core'

const meta: Meta<typeof MarkerHighlight> = {
  title: 'Core/MarkerHighlight',
  component: MarkerHighlight,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Marker Highlight

Emulates a highlighter-marker pen sweep across inline text. Renders an SVG rect behind the text with rounded ends, positioned to look like a natural hand-sweep — the stroke slightly overshoots the text on both ends.

Supports custom colors, variable thickness, and an optional entrance animation.

### Import
\`\`\`tsx
import { MarkerHighlight } from '@paper-ui/core'
\`\`\`

### Color Recommendations
- **Yellow (#f6e27a):** Default highlighter — general emphasis, search matches
- **Green (#b5f0b5):** Success, completion, correct answers
- **Pink (#f4c0c0):** Errors, important warnings, corrections
- **Blue (#b0d4f4):** Links, references, citations, secondary emphasis`,
      },
    },
  },
  argTypes: {
    color: {
      description: 'Marker ink color. CSS color string.',
      control: 'color',
      table: { defaultValue: { summary: '#f6e27a' } },
    },
    thickness: {
      description: 'Height of the marker sweep in px.',
      control: { type: 'number', min: 4, max: 24, step: 2 },
      table: { defaultValue: { summary: '8' } },
    },
    animate: {
      description: 'When true, animates the sweep from left to right on mount — mimicking a real highlighter stroke.',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      description: 'The text content to highlight. Short inline spans work best.',
    },
    className: {
      description: 'Additional CSS classes.',
    },
  },
}

export default meta
type Story = StoryObj<typeof MarkerHighlight>

export const Default: Story = {
  parameters: { docs: { description: { story: 'A classic yellow highlighter sweep across inline text.' } } },
  render: () => (
    <p className="font-kalam text-xl text-ink">
      The <MarkerHighlight>most important</MarkerHighlight> word on the page.
    </p>
  ),
}

export const Colors: Story = {
  parameters: { docs: { description: { story: 'Four preset colors — yellow, green, pink, and blue. Match to semantic meaning: green for success, pink for errors, blue for citations.' } } },
  render: () => (
    <div className="flex flex-col gap-3">
      {[
        { color: '#f6e27a', label: 'Yellow (default) — emphasis' },
        { color: '#b5f0b5', label: 'Green — success' },
        { color: '#f4c0c0', label: 'Pink — warning' },
        { color: '#b0d4f4', label: 'Blue — reference' },
      ].map(({ color, label }) => (
        <p key={color} className="font-kalam text-lg text-ink">
          <MarkerHighlight color={color}>{label}</MarkerHighlight>
        </p>
      ))}
    </div>
  ),
}

export const Thick: Story = {
  parameters: { docs: { description: { story: 'Increase \`thickness\` for a broader, more visible marker stroke. Use thicker values for headings, thinner for body text.' } } },
  render: () => (
    <p className="font-kalam text-xl text-ink">
      <MarkerHighlight thickness={14} color="#f6e27a">Extra thick sweep</MarkerHighlight>
    </p>
  ),
}

export const Animated: Story = {
  parameters: { docs: { description: { story: 'The \`animate\` prop triggers a sweep-in animation on mount — the highlight draws from left to right like a real marker pen.' } } },
  render: () => (
    <p className="font-kalam text-xl text-ink">
      <MarkerHighlight animate>Sweeps in on mount</MarkerHighlight>
      <span className="font-architect text-xs text-ink-muted ml-2">(refresh to see)</span>
    </p>
  ),
}

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

MarkerHighlight works inline within any text container.

### Design Guidelines
- **When to use:** Key terms in study materials, search result matches, important phrases in notes
- **When not to use:** Entire paragraphs, primary heading decoration (use Heading's \`marker\` prop), over dark backgrounds
- Keep highlighted spans short — 3–5 words max
- Use \`thickness={8}\` for body text, \`thickness={12}\` for headings
- Avoid more than 2–3 highlights per paragraph
- The SVG sweep is decorative — ensure text conveys meaning independently

### Related Components
- **Headings** — Typography components with built-in marker prop
- **SectionHeader** — Section titles with marker underline
- **PaperCard** — Paper surface for highlighted content`,
      },
    },
  },
  render: () => (
    <div className="space-y-6 max-w-md">
      <PaperH2>
        <MarkerHighlight color="#f6e27a" thickness={12}>Key Concept</MarkerHighlight>
      </PaperH2>

      <p className="font-kalam text-base text-ink leading-relaxed">
        The <MarkerHighlight color="#b5f0b5">gradient descent</MarkerHighlight> algorithm
        iteratively adjusts parameters to minimize the <MarkerHighlight color="#b0d4f4">loss function</MarkerHighlight>.
        Each step moves in the direction of steepest descent, scaled by the
        <MarkerHighlight color="#f4c0c0">learning rate</MarkerHighlight>.
      </p>

      <p className="font-kalam text-sm text-ink-muted">
        Yellow: key terms · Green: correct answers · Blue: references · Pink: warnings
      </p>
    </div>
  ),
}
