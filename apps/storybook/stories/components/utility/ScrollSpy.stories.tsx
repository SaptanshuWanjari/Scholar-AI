import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollSpy } from '@paper-ui/components/utility'

const meta: Meta<typeof ScrollSpy> = {
  title: 'Components/Utility/ScrollSpy',
  component: ScrollSpy,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof ScrollSpy>

const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'features', label: 'Features' },
  { id: 'install', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'api', label: 'API' },
]

export const Right: Story = {
  args: {
    sections: SECTIONS,
    activeSection: 'features',
    position: 'right',
  },
}

export const Left: Story = {
  args: {
    sections: SECTIONS,
    activeSection: 'install',
    position: 'left',
  },
}

export const WithContent: Story = {
  render: () => (
    <div className="flex min-h-screen bg-[#f4f1ea]">
      <div className="flex-1 px-16 py-10 space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-caveat text-[28px] font-bold text-ink mb-2">{s.label}</h2>
            <p className="font-kalam text-sm text-ink-muted max-w-lg">
              Content for {s.label.toLowerCase()}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </section>
        ))}
      </div>
      <div className="relative w-20 shrink-0">
        <ScrollSpy sections={SECTIONS} activeSection="usage" position="right" />
      </div>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div className="p-8 bg-[#f4f1ea]">
      <div className="fixed top-1/2 -translate-y-1/2 right-6">
        <ScrollSpy.Track>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className="w-2.5 h-2.5 rounded-full bg-[#bdb7a8]/50 hover:bg-[#bdb7a8]"
              title={s.label}
            />
          ))}
          <ScrollSpy.Thumb activeIndex={2} count={SECTIONS.length} />
        </ScrollSpy.Track>
      </div>
    </div>
  ),
}
