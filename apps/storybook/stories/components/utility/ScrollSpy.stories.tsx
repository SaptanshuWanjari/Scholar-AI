import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollSpy } from '@paper-ui/components/utility';

const meta: Meta<typeof ScrollSpy> = {
  title: 'Components/Utility/ScrollSpy',
  component: ScrollSpy,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ScrollSpy>;

const DEMO_SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'features', label: 'Features' },
  { id: 'install', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'api', label: 'API Reference' },
  { id: 'faq', label: 'FAQ' },
];

export const RightSide: Story = {
  args: {
    sections: DEMO_SECTIONS,
    activeSection: 'features',
    position: 'right',
  },
};

export const LeftSide: Story = {
  args: {
    sections: DEMO_SECTIONS,
    activeSection: 'install',
    position: 'left',
  },
};

export const WithContent: Story = {
  render: () => (
    <div className="flex min-h-screen bg-[#f4f1ea]">
      <div className="flex-1 px-16 py-10 space-y-12">
        {DEMO_SECTIONS.map((s) => (
          <section key={s.id} id={s.id}>
            <h2 className="font-caveat text-[28px] font-bold text-ink mb-3">{s.label}</h2>
            <p className="font-kalam text-sm text-ink-muted max-w-lg">
              Content for {s.label.toLowerCase()} section. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
          </section>
        ))}
      </div>
      <div className="relative w-20 shrink-0">
        <ScrollSpy
          sections={DEMO_SECTIONS}
          activeSection="usage"
          position="right"
        />
      </div>
    </div>
  ),
};
