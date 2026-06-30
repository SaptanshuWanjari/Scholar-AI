import type { Meta, StoryObj } from '@storybook/react-vite'
import { PaperH1, PaperH2, PaperH3, PaperH4, PaperH5, PaperH6 } from '@paper-ui/core'

const meta: Meta = {
  title: 'Core/Headings',
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj

export const Scale: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PaperH1>Heading 1 — Caveat 38 px bold</PaperH1>
      <PaperH2>Heading 2 — Caveat 28 px semibold</PaperH2>
      <PaperH3>Heading 3 — Kalam 20 px bold</PaperH3>
      <PaperH4>Heading 4 — Kalam 15 px bold</PaperH4>
      <PaperH5>Heading 5 — Architects Daughter uppercase</PaperH5>
      <PaperH6>Heading 6 — Architects Daughter muted</PaperH6>
    </div>
  ),
}

export const WithMarker: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <PaperH1 marker markerColor="#f6e27a">Highlighted H1</PaperH1>
      <PaperH2 marker markerColor="#b5f0b5">Highlighted H2</PaperH2>
      <PaperH3 marker>Highlighted H3 (default yellow)</PaperH3>
      <PaperH4 marker markerColor="#f4c0c0">Highlighted H4</PaperH4>
    </div>
  ),
}
