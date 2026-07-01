import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperH1, PaperH2, PaperH3, PaperH4, PaperH5, PaperH6 } from '@paper-ui/core'

const meta: Meta = {
  title: 'Core/Headings',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `## Headings

A complete heading scale (H1–H6) using handwriting and sketch fonts instead of traditional sans-serif. Each level has a distinct font, size, weight, and character.

### Typography Scale
| Component | Element | Font | Size | Weight |
|-----------|---------|------|------|--------|
| PaperH1 | \`<h1>\` | Caveat | 38px | Bold 700 |
| PaperH2 | \`<h2>\` | Caveat | 28px | Semi-bold 600 |
| PaperH3 | \`<h3>\` | Kalam | 20px | Bold 700 |
| PaperH4 | \`<h4>\` | Kalam | 15px | Bold 700 |
| PaperH5 | \`<h5>\` | Architects Daughter | 14px | Normal 400 |
| PaperH6 | \`<h6>\` | Architects Daughter | 12px | Normal 400 |

All headings support an optional \`marker\` highlight underline with configurable \`markerColor\`.

### Import
\`\`\`tsx
import { PaperH1, PaperH2, PaperH3, PaperH4, PaperH5, PaperH6 } from '@paper-ui/core'
\`\`\``,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Scale: Story = {
  parameters: { docs: { description: { story: 'The full heading scale H1 through H6 — each with its distinct font, size, and character. All render semantic HTML heading elements.' } } },
  render: () => (
    <div className="flex flex-col gap-4">
      <PaperH1>Heading 1 — Caveat 38px bold</PaperH1>
      <PaperH2>Heading 2 — Caveat 28px semibold</PaperH2>
      <PaperH3>Heading 3 — Kalam 20px bold</PaperH3>
      <PaperH4>Heading 4 — Kalam 15px bold</PaperH4>
      <PaperH5>Heading 5 — Architects Daughter uppercase</PaperH5>
      <PaperH6>Heading 6 — Architects Daughter muted</PaperH6>
    </div>
  ),
}

export const WithMarker: Story = {
  parameters: { docs: { description: { story: 'Headings with the \`marker\` prop display a highlighter underline. Customize \`markerColor\` per heading. The marker sweep is SVG-based and slightly overshoots the text.' } } },
  render: () => (
    <div className="flex flex-col gap-4">
      <PaperH1 marker markerColor="#f6e27a">Highlighted H1</PaperH1>
      <PaperH2 marker markerColor="#b5f0b5">Highlighted H2</PaperH2>
      <PaperH3 marker>Highlighted H3 (default yellow)</PaperH3>
      <PaperH4 marker markerColor="#f4c0c0">Highlighted H4</PaperH4>
    </div>
  ),
}

export const DocumentStructure: Story = {
  parameters: {
    docs: {
      description: {
        story: `## Composition

Headings follow standard HTML hierarchy. Use them to create a logical document outline.

### Design Guidelines
- **When to use:** Page titles (H1), section headings (H2–H3), card titles (H3–H4), labels (H5–H6)
- **When not to use:** Legal/compliance documents (use standard fonts), code-related UI (use monospace), when strict WCAG font legibility requirements apply
- Use H1 once per page as the primary title
- Reserve \`marker\` for H1–H3 where visual emphasis matters most
- Choose marker colors that complement surrounding content

### Accessibility
- All components render native \`<h1>\` through \`<h6>\` elements
- Marker underline is purely decorative — does not affect semantic meaning
- Always maintain logical heading hierarchy — don't skip levels

### Related Components
- **MarkerHighlight** — The underlying marker sweep primitive
- **SectionHeader** — Section titles with marker underline and action slot
- **PaperCard** — Paper surface that commonly contains headings`,
      },
    },
  },
  render: () => (
    <div className="space-y-6 max-w-lg">
      <PaperH1 marker markerColor="#f6e27a">
        Course: Machine Learning
      </PaperH1>
      <PaperH2 marker markerColor="#b0d4f4">
        Module 3: Neural Networks
      </PaperH2>
      <PaperH3 marker markerColor="#b5f0b5">
        Backpropagation Algorithm
      </PaperH3>
      <PaperH4>Forward Pass</PaperH4>
      <p className="font-kalam text-sm text-ink leading-relaxed">
        During the forward pass, input data flows through the network layer by layer,
        producing predictions at the output layer.
      </p>
      <PaperH4>Backward Pass</PaperH4>
      <p className="font-kalam text-sm text-ink leading-relaxed">
        The backward pass computes gradients of the loss with respect to each parameter
        using the chain rule, propagating errors from output back to input.
      </p>
      <PaperH5>SUPPLEMENTARY MATERIALS</PaperH5>
      <PaperH6 className="italic">Section 3.1 — Gradient Descent Review</PaperH6>
    </div>
  ),
}
