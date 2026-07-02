import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchResults } from "@paper-ui/components/search";
import type { SearchResultItem } from "@paper-ui/components/search";
import { FileText, BookOpen, StickyNote, Presentation } from "lucide-react";

const meta = {
  title: "Components/Search/SearchResults",
  component: SearchResults,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof SearchResults>;

const sampleResults: SearchResultItem[] = [
  {
    id: "1",
    title: "Introduction to Algorithms — Chapter 3",
    description: "Growth of functions, asymptotic notation, and standard notations for running time complexity...",
    icon: <BookOpen size={16} />,
    meta: "PDF · 12 pages",
  },
  {
    id: "2",
    title: "Dynamic Programming Notes",
    description: "Optimal substructure, overlapping subproblems, memoization vs tabulation approaches...",
    icon: <FileText size={16} />,
    meta: "Markdown · 5 min read",
  },
  {
    id: "3",
    title: "Operating Systems — Deadlock",
    description: "Conditions for deadlock: mutual exclusion, hold and wait, no preemption, circular wait...",
    icon: <Presentation size={16} />,
    meta: "Slides · 8 pages",
  },
  {
    id: "4",
    title: "Database Normalization Quick Reference",
    description: "1NF, 2NF, 3NF, BCNF normal forms with examples and decomposition steps...",
    icon: <StickyNote size={16} />,
    meta: "Note · Updated today",
  },
];

export const WithResults: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[520px]">
        <SearchResults>
          <SearchResults.Header total={sampleResults.length} query="algorithms" />
          <SearchResults.List>
            {sampleResults.map((item) => (
              <SearchResults.Item
                key={item.id}
                item={item}
                onClick={(i) => console.log("Selected:", i.title)}
              />
            ))}
          </SearchResults.List>
        </SearchResults>
      </div>
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[520px]">
        <SearchResults>
          <SearchResults.Header total={0} query="quantum chromodynamics" />
          <SearchResults.Empty
            title="No matching documents"
            description="We looked everywhere but couldn't find anything. Maybe a different search term?"
            suggestions={["algorithms", "data structures", "set theory"]}
            onSuggestionClick={(s) => console.log("Suggestion:", s)}
          />
        </SearchResults>
      </div>
    </div>
  ),
};

export const SingleResult: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[520px]">
        <SearchResults>
          <SearchResults.Header total={1} query="deadlock" />
          <SearchResults.List>
            <SearchResults.Item
              item={sampleResults[2]}
              onClick={(i) => console.log("Selected:", i.title)}
            />
          </SearchResults.List>
        </SearchResults>
      </div>
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[520px]">
        <SearchResults>
          <SearchResults.Header total={3} query="osmosis" />
          <SearchResults.List maxHeight={320}>
            <SearchResults.Item
              item={{ id: "a", title: "Cell Transport — Chapter 4", description: "Active and passive transport across membranes.", icon: <BookOpen size={16} />, meta: "Biology" }}
              onClick={() => {}}
            />
            <SearchResults.Item
              item={{ id: "b", title: "Osmotic Pressure equations", description: "π = iMRT formula derivation and worked examples.", icon: <FileText size={16} />, meta: "Chemistry" }}
              onClick={() => {}}
            />
            <SearchResults.Item
              item={{ id: "c", title: "Lab notes: membrane permeability", description: "Observations from dialysis tubing experiment.", icon: <StickyNote size={16} />, meta: "Lab" }}
              onClick={() => {}}
            />
          </SearchResults.List>
        </SearchResults>
      </div>
    </div>
  ),
};
