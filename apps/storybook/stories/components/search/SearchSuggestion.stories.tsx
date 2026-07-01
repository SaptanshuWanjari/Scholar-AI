import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchSuggestion } from "@paper-ui/components/search";
import type { SearchSuggestionItem } from "@paper-ui/components/search";
import { BookOpen, FileText, Presentation, StickyNote } from "lucide-react";

const meta = {
  title: "Components/Search/SearchSuggestion",
  component: SearchSuggestion,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchSuggestion>;

export default meta;
type Story = StoryObj<typeof SearchSuggestion>;

const suggestions: SearchSuggestionItem[] = [
  { id: "s1", label: "Introduction to Algorithms", description: "CS 250 — Chapter 3", icon: <BookOpen size={14} />, shortcut: "⌘1" },
  { id: "s2", label: "Dynamic Programming", description: "Lecture notes — memoization", icon: <FileText size={14} />, shortcut: "⌘2" },
  { id: "s3", label: "Deadlock Conditions", description: "Operating Systems — slides", icon: <Presentation size={14} />, shortcut: "⌘3" },
  { id: "s4", label: "Database Normalization", description: "Quick reference — 1NF to BCNF", icon: <StickyNote size={14} /> },
  { id: "s5", label: "Sorting Algorithms", description: "Merge, quick, heap sort comparison", icon: <FileText size={14} /> },
];

export const Default: Story = {
  render: () => {
    const [highlight, setHighlight] = useState(0);
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <div
          className="w-[400px]"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
            if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
          }}
        >
          <SearchSuggestion
            suggestions={suggestions}
            onSelect={(item) => console.log("Selected:", item.label)}
            highlightIndex={highlight}
          />
        </div>
      </div>
    );
  },
};

export const NoDescriptions: Story = {
  render: () => {
    const simple: SearchSuggestionItem[] = [
      { id: "s1", label: "algorithms" },
      { id: "s2", label: "algorithms visualization" },
      { id: "s3", label: "algorithm complexity" },
    ];
    return (
      <div className="p-10 bg-[#f4f1ea]">
        <div className="w-[400px]">
          <SearchSuggestion
            suggestions={simple}
            onSelect={(item) => console.log("Selected:", item.label)}
            highlightIndex={0}
          />
        </div>
      </div>
    );
  },
};

export const Hidden: Story = {
  render: () => (
    <div className="p-10 bg-[#f4f1ea]">
      <div className="w-[400px]">
        <SearchSuggestion
          suggestions={suggestions}
          onSelect={(item) => console.log("Selected:", item.label)}
          visible={false}
        />
      </div>
    </div>
  ),
};
