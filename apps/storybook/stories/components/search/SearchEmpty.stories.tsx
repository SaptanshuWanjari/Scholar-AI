import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchEmpty } from "@paper-ui/components/search";

const meta = {
  title: "Components/Search/SearchEmpty",
  component: SearchEmpty,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof SearchEmpty>;

export default meta;
type Story = StoryObj<typeof SearchEmpty>;

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[460px]">
        <SearchEmpty />
      </div>
    </div>
  ),
};

export const CustomMessage: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[460px]">
        <SearchEmpty
          title="Nothing matched your query"
          description='Try searching for "algorithms", "data structures", or browse by course instead.'
        />
      </div>
    </div>
  ),
};

export const WithSuggestions: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[460px]">
        <SearchEmpty
          title="No flashcards found"
          description="You haven't created any flashcards yet. Try one of these topics to get started."
          suggestions={["binary trees", "sorting algorithms", "time complexity", "graph traversal", "hash tables"]}
          onSuggestionClick={(s) => console.log("Suggestion clicked:", s)}
        />
      </div>
    </div>
  ),
};

export const ShortDescription: Story = {
  render: () => (
    <div className="flex justify-center p-10 bg-[#f4f1ea]">
      <div className="w-[460px]">
        <SearchEmpty
          title="No notes found"
          suggestions={["algorithms", "databases"]}
          onSuggestionClick={(s) => console.log("Suggestion:", s)}
        />
      </div>
    </div>
  ),
};
