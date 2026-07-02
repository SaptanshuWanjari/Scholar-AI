import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Paper, PaperShadow, PaperTexture, SketchBorder } from '@paper-ui/components/paper';
import { Tape, NotebookEdge } from '@paper-ui/components/decorations';

const meta = {
  title: 'Components/Wrappers/Paper',
  component: Paper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `## Paper

The base paper surface component — a customizable paper-like container with built-in texture, sketch borders, and soft shadows. Use for notes, lists, meeting pages, and any content that benefits from a physical notebook aesthetic.

### Variants
- **Paper** — warm-fill card with sketch border, shadow, and optional texture overlay
- **PaperShadow** — standalone shadow layer for layering
- **PaperTexture** — fiber/noise texture overlay
- **SketchBorder** — rough.js SVG border primitive

### Common patterns
- Taped notes with masking tape decoration
- Notebook pages with hole-punch edges
- Sketch-style borders with configurable roughness`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof Paper>;

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <Paper className="w-80 p-6 flex flex-col gap-4">
        <h3 className="font-serif text-xl text-[#2c2c2c] font-bold">Paper Component</h3>
        <p className="font-mono text-[#4a4a4a] text-sm">
          A customizable paper-like container with built-in texture, sketch borders, and soft shadows.
        </p>
      </Paper>
    </div>
  ),
};

export const TapedNote: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper shadow="lg" border={null} className="w-72 p-6 rotate-2">
        <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-[-4deg]" color="#f0d3a8" />
        <h3 className="font-serif text-xl text-[#2c2c2c] font-bold mb-2">Shopping List</h3>
        <ul className="font-mono text-[#4a4a4a] text-sm space-y-2 list-disc pl-4">
          <li>Coffee beans</li>
          <li>Sketchpad</li>
          <li>Graphite pencils</li>
        </ul>
      </Paper>
    </div>
  ),
};

export const Notebook: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <Paper className="w-80 h-96 p-8 pl-12" shadow="lg">
        <NotebookEdge position="left" holes={16} />
        <h3 className="font-handwriting text-2xl text-[#2c2c2c] font-bold mb-4 underline decoration-2 decoration-[#e88c8c] underline-offset-4">Meeting Notes</h3>
        <div className="space-y-4">
          <p className="font-mono text-[#4a4a4a] text-sm leading-relaxed border-b border-black/10 pb-1">
            Discussed the new design system.
          </p>
          <p className="font-mono text-[#4a4a4a] text-sm leading-relaxed border-b border-black/10 pb-1">
            Need more textures and doodles.
          </p>
        </div>
      </Paper>
    </div>
  ),
};
