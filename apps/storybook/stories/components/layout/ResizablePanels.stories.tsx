import React from 'react';
import type { Meta } from '@storybook/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@paper-ui/components/layout';
import { StickyNote, PushPin, Tape, Scribble, CoffeeRing } from '@paper-ui/components/decorations';
import { PaperCard, PaperH3 } from '@paper-ui/core';
import { Dock } from '@paper-ui/components/layout';

const meta = {
  title: 'Components/Layout/ResizablePanels',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;

export const SplitNotebook = () => (
  <div className="p-8 bg-[#f4f1ea] h-[500px]">
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border-2 border-ink/15 overflow-hidden">
      <ResizablePanel defaultSize={40} minSize={25}>
        <PaperCard className="h-full p-6" surface="#fffdf9" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <PushPin color="#b5685e" position="top-left" />
          <PaperH3>Notes</PaperH3>
          <StickyNote color="#fdf6b5" size={120} rotate={-1} pin="none" className="mt-8 mx-auto">
            <div className="font-kalam text-sm p-2">
              Resize the panels
              by dragging the
              handle between them!
            </div>
          </StickyNote>
          <div className="mt-6 font-kalam text-ink-muted text-sm space-y-2">
            <div className="flex items-center gap-2"><input type="checkbox" className="accent-ink/40" defaultChecked /><span>Task one done</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="accent-ink/40" /><span>Task two pending</span></div>
            <div className="flex items-center gap-2"><input type="checkbox" className="accent-ink/40" /><span>Task three pending</span></div>
          </div>
        </PaperCard>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={60} minSize={30}>
        <PaperCard className="h-full p-6 relative" surface="#fcfaf6" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <Tape corner="top-right" width={60} />
          <PaperH3>Preview</PaperH3>
          <div className="mt-4 space-y-3">
            <Scribble className="w-full h-8 text-ink/20" />
            <div className="h-2 w-3/4 bg-ink/10 rounded-full" />
            <div className="h-2 w-1/2 bg-ink/10 rounded-full" />
            <div className="h-2 w-5/6 bg-ink/10 rounded-full" />
            <div className="mt-6">
              <Scribble className="w-2/3 h-8 text-ink/15" />
              <div className="h-2 w-full bg-ink/8 rounded-full mt-2" />
              <div className="h-2 w-4/5 bg-ink/8 rounded-full mt-2" />
              <div className="h-2 w-3/5 bg-ink/8 rounded-full mt-2" />
            </div>
          </div>
          <CoffeeRing position="bottom-right" size={60} opacity={0.08} rotate={10} />
        </PaperCard>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export const ThreePanelLayout = () => (
  <div className="p-8 bg-[#f4f1ea] h-[500px]">
    <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border-2 border-ink/15 overflow-hidden">
      <ResizablePanel defaultSize={20} minSize={15}>
        <PaperCard className="h-full p-4" surface="#fff8f5" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <div className="font-architect font-bold text-sm text-ink/70 mb-4">Sidebar</div>
          <div className="space-y-2">
            {['Home', 'Journal', 'Tasks', 'Files', 'Settings'].map((item) => (
              <div key={item} className="font-kalam text-ink-muted px-2 py-1 hover:bg-ink/5 rounded cursor-pointer transition-colors text-sm">
                {item}
              </div>
            ))}
          </div>
          <PushPin color="var(--color-red)" position="top-right" size={18} />
        </PaperCard>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={60} minSize={30}>
            <PaperCard className="h-full p-5 relative" surface="#fffdf9" border={{ stroke: 'none' }} shadow={0} texture={false}>
              <Tape corner="top-center" width={70} />
              <PaperH3>Main Content</PaperH3>
              <div className="mt-4 font-kalam text-ink-muted space-y-2 text-sm">
                <p>This is the main content area. Resize the sidebar to make more room for reading.</p>
                <p>The bottom panel and this one are separated by a horizontal resize handle.</p>
                <StickyNote color="#fdf6b5" size={80} rotate={1} pin="none" className="inline-block mt-3">
                  <span className="font-kalam text-xs">Important!</span>
                </StickyNote>
              </div>
            </PaperCard>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40} minSize={20}>
            <PaperCard className="h-full p-4 relative" surface="#f7faf5" border={{ stroke: 'none' }} shadow={0} texture={false}>
              <div className="font-architect font-bold text-sm text-ink/70 mb-2">Details / Console</div>
              <div className="font-kalam text-xs text-ink-muted space-y-1">
                <div className="text-sage-soft font-bold">&gt; npm run build</div>
                <div>Building components...</div>
                <div>✓ Compiled successfully</div>
                <div>✓ 42 modules transformed</div>
              </div>
              <CoffeeRing position="bottom-left" size={50} opacity={0.06} />
            </PaperCard>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={20}>
        <PaperCard className="h-full p-4 relative" surface="#f8f6ff" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <div className="font-architect font-bold text-sm text-ink/70 mb-4">Inspector</div>
          <Scribble className="w-full h-8 text-ink/15" />
          <div className="mt-3 space-y-2">
            <div className="h-2 w-full bg-ink/8 rounded-full" />
            <div className="h-2 w-5/6 bg-ink/8 rounded-full" />
            <div className="h-2 w-2/3 bg-ink/8 rounded-full" />
            <div className="h-2 w-4/5 bg-ink/8 rounded-full" />
          </div>
          <PushPin color="var(--color-ochre)" position="top-right" size={18} rotate={15} />
        </PaperCard>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export const DockAndPanels = () => (
  <div className="p-8 bg-[#f4f1ea] h-[600px]">
    <ResizablePanelGroup direction="vertical" className="h-full rounded-lg border-2 border-ink/15 overflow-hidden">
      <ResizablePanel defaultSize={70} minSize={40}>
        <PaperCard className="h-full p-6 relative" surface="#fffdf9" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <Tape corner="top-left" width={80} />
          <PaperH3>Workspace</PaperH3>
          <div className="mt-4 font-kalam text-ink-muted">
            <p>Your content goes here. Resize the handle below to give the dock more breathing room.</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <StickyNote color="#fdf6b5" size={100} rotate={-1.5} pin="none" className="mx-auto">
                <span className="font-kalam text-xs">Draft ideas</span>
              </StickyNote>
              <StickyNote color="#dbeafe" size={100} rotate={1} pin="none" className="mx-auto">
                <span className="font-kalam text-xs">Research links</span>
              </StickyNote>
            </div>
          </div>
        </PaperCard>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={15}>
        <PaperCard className="h-full" surface="#f5f1ec" border={{ stroke: 'none' }} shadow={0} texture={false}>
          <Dock className="h-full p-4" gap={24}>
            <div className="w-12 h-12 rounded-full bg-sky-soft border-2 border-ink/20 flex items-center justify-center font-kalam text-lg text-ink-muted">A</div>
            <div className="w-12 h-12 rounded-full bg-ochre-soft border-2 border-ink/20 flex items-center justify-center font-kalam text-lg text-ink-muted">B</div>
            <div className="w-12 h-12 rounded-full bg-sage-soft border-2 border-ink/20 flex items-center justify-center font-kalam text-lg text-ink-muted">C</div>
            <div className="w-12 h-12 rounded-full bg-lavender-soft border-2 border-ink/20 flex items-center justify-center font-kalam text-lg text-ink-muted">D</div>
            <div className="w-12 h-12 rounded-full bg-brick-soft border-2 border-ink/20 flex items-center justify-center font-kalam text-lg text-ink-muted">E</div>
          </Dock>
        </PaperCard>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);
