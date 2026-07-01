import React from "react";
import type { Meta } from "@storybook/react-vite";
import { Panel } from "@paper-ui/components/panel";
import { PaperButton } from "@paper-ui/components/buttons";
import { PaperInput } from "@paper-ui/components/inputs";
import { TapeCrease, TapeScribble } from "@paper-ui/components/decorations";
import { Tape } from "@paper-ui/components/decorations";
import { FolderIcon } from "@paper-ui/icons";

const meta = {
  title: "Components/Panel",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;
export default meta;

export const SidePanel = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <div className="relative max-w-sm">
      <Panel>
        <Tape corner="top-left" />
        <Tape corner="bottom-right" rotate={-4} />
        <Panel.Header>
          <Panel.Title marker>Course Notes</Panel.Title>
          <PaperButton tone="paper" size="sm">Close</PaperButton>
        </Panel.Header>
        <Panel.Content className="font-kalam text-ink-muted text-[15px] leading-relaxed">
          <p>
            Neural networks learn by adjusting weights through
            backpropagation. Each training iteration computes gradients
            and updates parameters to minimize the loss.
          </p>
          <p className="mt-3">
            Convolutional layers excel at detecting spatial hierarchies
            in images, from simple edges to complex object parts.
          </p>
        </Panel.Content>
        <Panel.Footer>
          <Panel.Actions>
            <PaperButton tone="paper" size="sm">Cancel</PaperButton>
            <PaperButton tone="dark" size="sm">Save</PaperButton>
          </Panel.Actions>
        </Panel.Footer>
      </Panel>
    </div>
  </div>
);

export const ToolbarPanel = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <div className="max-w-md">
      <Panel>
        <Panel.Toolbar>
          <FolderIcon size={16} />
          <span className="font-architect text-[13px] text-ink-muted">
            /courses/machine-learning
          </span>
          <div className="flex-1" />
          <PaperButton tone="paper" size="sm">Save</PaperButton>
        </Panel.Toolbar>
        <Panel.Content className="font-kalam text-ink-muted text-[15px]">
          <p>Select a document from the sidebar to begin editing.</p>
        </Panel.Content>
      </Panel>
    </div>
  </div>
);

export const NotebookPanel = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <div className="max-w-md">
      <Panel variant="notebook" className="min-h-[300px]">
        <Tape corner="top-center" rotate={-2} />
        <Panel.Header>
          <Panel.Title>Week 3 — Backpropagation</Panel.Title>
        </Panel.Header>
        <Panel.Content
          className="font-kalam text-ink-muted text-[14px] leading-loose"
          style={{ lineHeight: "28px" }}
        >
          <p>· Gradient of loss w.r.t. weights</p>
          <p>· Chain rule through hidden layers</p>
          <p>· Vanishing gradient in deep nets</p>
          <p>· ReLU and batch norm as remedies</p>
          <p>· Learning rate scheduling</p>
        </Panel.Content>
        <Panel.Footer>
          <span className="font-architect text-[12px] text-ink-muted/60">
            Last edited: June 28, 2026
          </span>
        </Panel.Footer>
      </Panel>
    </div>
  </div>
);

export const DashedPanel = () => (
  <div className="p-10 bg-[#f4f1ea]">
    <div className="max-w-sm">
      <Panel variant="dashed">
        <Panel.Content className="flex flex-col items-center gap-3 py-8 text-center">
          <FolderIcon size={32} />
          <Panel.Title>Note</Panel.Title>
          <p className="font-kalam text-ink-muted text-[14px]">
            A dashed panel works well for callouts and temporary notes.
          </p>
        </Panel.Content>
      </Panel>
    </div>
  </div>
);

export const PanelGallery = () => (
  <div className="p-10 bg-[#f4f1ea] min-h-[600px] relative overflow-hidden">
    {/* Side Panel — rotated slightly */}
    <div style={{ transform: "rotate(-2deg)" }} className="max-w-sm mb-8">
      <Panel>
        <Tape corner="top-left" />
        <Tape corner="bottom-right" rotate={5} />
        <Panel.Header>
          <Panel.Title marker>Study Plan</Panel.Title>
        </Panel.Header>
        <Panel.Content className="font-kalam text-ink-muted text-[14px]">
          <p>Review linear algebra notes</p>
          <p>Complete quiz on neural networks</p>
          <p>Read chapter 5 on optimization</p>
        </Panel.Content>
        <Panel.Footer>
          <Panel.Actions>
            <PaperButton tone="dark" size="sm">Start</PaperButton>
          </Panel.Actions>
        </Panel.Footer>
      </Panel>
    </div>

    {/* Dashed callout */}
    <div
      className="max-w-xs ml-auto"
      style={{ transform: "rotate(1.5deg)" }}
    >
      <Panel variant="dashed">
        <Panel.Content className="text-center py-6">
          <p className="font-caveat text-[20px] text-ink font-bold">
            Don&apos;t forget to review!
          </p>
          <p className="font-kalam text-ink-muted text-[13px] mt-1">
            Quiz tomorrow at 10 AM
          </p>
        </Panel.Content>
      </Panel>
    </div>

    {/* Toolbar panel with washi tape divider */}
    <div
      className="max-w-md mt-8"
      style={{ transform: "rotate(-0.5deg)" }}
    >
      <TapeScribble
        width={320}
        color="#e8c9a0"
        className="mx-auto -mb-1"
      />
      <Panel>
        <Panel.Toolbar>
          <FolderIcon size={14} />
          <span className="font-architect text-[12px] text-ink-muted">
            Resources
          </span>
        </Panel.Toolbar>
        <Panel.Content className="font-kalam text-ink-muted text-[13px]">
          <p>· Lecture slides (PDF)</p>
          <p>· Practice problems</p>
          <p>· Reference papers</p>
        </Panel.Content>
      </Panel>
    </div>

    {/* Notebook panel lower right */}
    <div
      className="max-w-xs absolute bottom-6 right-6"
      style={{ transform: "rotate(2deg)" }}
    >
      <Panel variant="notebook" className="min-h-[180px]">
        <Tape corner="top-right" rotate={-3} />
        <Panel.Content
          className="font-kalam text-ink-muted text-[13px]"
          style={{ lineHeight: "28px" }}
        >
          <p>Ideas for project:</p>
          <p>· Implement dropout layer</p>
          <p>· Test on MNIST dataset</p>
          <p>· Compare optimizer perf</p>
        </Panel.Content>
      </Panel>
    </div>

    {/* Decorative washi tape across gallery */}
    <TapeCrease
      width={200}
      color="#b8d4c8"
      className="absolute top-20 left-1/2 -translate-x-1/2"
      style={{ transform: "rotate(-8deg)" }}
    />
  </div>
);
