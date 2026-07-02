import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { MasonryGrid } from '@paper-ui/components/media'
import { Caption } from '@paper-ui/components/typography'

const meta: Meta<typeof MasonryGrid> = {
  title: 'Components/Media/MasonryGrid',
  component: MasonryGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof MasonryGrid>

const cards = [
  { h: 160, c: '#e8e4dc', t: 'Linear Algebra' },
  { h: 200, c: '#dfebd6', t: 'Calculus III' },
  { h: 120, c: '#dde4f0', t: 'Probability' },
  { h: 180, c: '#f0ebe2', t: 'Statistics' },
  { h: 140, c: '#ebe0d4', t: 'Optimization' },
  { h: 220, c: '#e2dbe6', t: 'Graph Theory' },
  { h: 160, c: '#dce4d8', t: 'Number Theory' },
  { h: 100, c: '#f0efed', t: 'Topology' },
]

export const Default: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>columns=3, gap=16</Caption>
      <MasonryGrid columns={3} gap={16} className="mt-2">
        {cards.map((card) => (
          <div
            key={card.t}
            className="rounded-lg p-4 border border-[#d4cfc2] font-kalam text-[#3a3733]"
            style={{ height: card.h, background: card.c, marginBottom: 16 }}
          >
            <strong>{card.t}</strong>
            <p className="text-xs text-[#9c9484] mt-1">Sample note content for {card.t.toLowerCase()}.</p>
          </div>
        ))}
      </MasonryGrid>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="p-10 space-y-8 bg-[#f4f1ea]">
      <section className="space-y-2">
        <Caption>columns=3, gap=16</Caption>
        <MasonryGrid columns={3} gap={16} className="mt-2">
          {cards.map((card) => (
            <div
              key={card.t}
              className="rounded-lg p-4 border border-[#d4cfc2] font-kalam text-[#3a3733]"
              style={{ height: card.h, background: card.c, marginBottom: 16 }}
            >
              <strong>{card.t}</strong>
              <p className="text-xs text-[#9c9484] mt-1">Sample note content for {card.t.toLowerCase()}.</p>
            </div>
          ))}
        </MasonryGrid>
      </section>

      <section className="space-y-2">
        <Caption>columns=4, gap=12</Caption>
        <MasonryGrid columns={4} gap={12}>
          {Array.from({ length: 12 }, (_, i) => {
            const h = 80 + Math.random() * 120
            return (
              <div
                key={i}
                className="rounded-lg border border-[#d4cfc2] flex items-center justify-center font-architect text-xs text-[#9c9484]"
                style={{ height: h, background: '#faf8f5', marginBottom: 12 }}
              >
                Tile {i + 1}
              </div>
            )
          })}
        </MasonryGrid>
      </section>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <Caption>Empty grid</Caption>
      <MasonryGrid columns={3} gap={16}>
        {[]}
      </MasonryGrid>
    </div>
  ),
}
