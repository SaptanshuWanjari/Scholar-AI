import React from "react";
import type { Meta } from "@storybook/react-vite";
import { Panel } from "@paper-ui/components/panel";
import { PaperButton } from "@paper-ui/components/buttons";
import { Tape } from "@paper-ui/components/decorations";
import { FolderIcon } from "@paper-ui/icons";

const meta = {
  title: 'Components/Wrappers/Panel',
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;
export default meta;

export const Default = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="max-w-sm">
      <Panel>
        <Panel.Header>
          <Panel.Title marker>Course Notes</Panel.Title>
          <PaperButton tone="paper" size="sm">Close</PaperButton>
        </Panel.Header>
        <Panel.Content className="font-kalam text-ink-muted text-[15px] leading-relaxed">
          <p>Neural networks learn by adjusting weights through backpropagation.</p>
          <p className="mt-3">Convolutional layers detect spatial hierarchies in images.</p>
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

export const WithToolbar = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="max-w-md">
      <Panel>
        <Panel.Toolbar>
          <FolderIcon size={16} />
          <span className="font-architect text-[13px] text-ink-muted">/courses/machine-learning</span>
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

export const Notebook = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="max-w-md">
      <Panel variant="notebook" className="min-h-[280px]">
        <Tape corner="top-center" rotate={-2} />
        <Panel.Header>
          <Panel.Title>Week 3 — Backpropagation</Panel.Title>
        </Panel.Header>
        <Panel.Content className="font-kalam text-ink-muted text-[14px] leading-loose" style={{ lineHeight: "28px" }}>
          <p>· Gradient of loss w.r.t. weights</p>
          <p>· Chain rule through hidden layers</p>
          <p>· Vanishing gradient in deep nets</p>
          <p>· ReLU and batch norm as remedies</p>
        </Panel.Content>
        <Panel.Footer>
          <span className="font-architect text-[12px] text-ink-muted/60">Last edited: June 28, 2026</span>
        </Panel.Footer>
      </Panel>
    </div>
  </div>
);

export const Dashed = () => (
  <div className="p-8 bg-[#f4f1ea]">
    <div className="max-w-sm">
      <Panel variant="dashed">
        <Panel.Content className="flex flex-col items-center gap-3 py-8 text-center">
          <FolderIcon size={32} />
          <Panel.Title>Drop files here</Panel.Title>
          <p className="font-kalam text-ink-muted text-[14px]">PDFs, markdown, and text files supported.</p>
        </Panel.Content>
      </Panel>
    </div>
  </div>
);
