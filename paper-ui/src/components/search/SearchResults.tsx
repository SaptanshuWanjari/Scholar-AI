import React from "react";
import { cn } from "@paper-ui/utils";
import { SketchBorder } from "@paper-ui/core";
import { SearchEmpty } from "./SearchEmpty";
import type { SearchEmptyProps } from "./SearchEmpty";

export interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  meta?: string;
}

export interface SearchResultsRootProps {
  children?: React.ReactNode;
  className?: string;
}

const SearchResultsRoot = React.forwardRef<HTMLDivElement, SearchResultsRootProps>(
  function SearchResultsRoot({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden rounded-[8px] bg-[#fffdf9]", className)}
      >
        <SketchBorder
          fill="#fffdf9"
          stroke="#b4ad9e"
          strokeWidth={1.2}
          roughness={1.2}
          radius={8}
          shadow={0}
        />
        <div className="relative z-[1]">{children}</div>
      </div>
    );
  },
);
SearchResultsRoot.displayName = "SearchResults";

export interface SearchResultsHeaderProps {
  total: number;
  query?: string;
  children?: React.ReactNode;
  className?: string;
}

function SearchResultsHeader({ total, query, children, className }: SearchResultsHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-[#d4cec4]/50 px-4 py-2.5", className)}>
      <span className="font-kalam text-[12px] text-ink-muted">
        {total === 0
          ? "No results"
          : `${total} result${total === 1 ? "" : "s"}`}
        {query && total > 0 && <span> for &ldquo;{query}&rdquo;</span>}
      </span>
      {children}
    </div>
  );
}
SearchResultsHeader.displayName = "SearchResults.Header";

export interface SearchResultsListProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: number | string;
}

function SearchResultsList({ children, className, maxHeight = "60vh" }: SearchResultsListProps) {
  return (
    <div
      className={cn("overflow-y-auto", className)}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
SearchResultsList.displayName = "SearchResults.List";

export interface SearchResultsItemProps {
  item: SearchResultItem;
  onClick?: (item: SearchResultItem) => void;
  className?: string;
}

function SearchResultsItem({ item, onClick, className }: SearchResultsItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className={cn(
        "group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f0ede4]",
        className,
      )}
    >
      {item.icon && (
        <span className="relative mt-0.5 shrink-0 text-ink-muted transition-transform group-hover:-rotate-6">
          {item.icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="relative inline-block">
          <span className="font-architect text-[14px] font-medium text-ink">
            {item.title}
          </span>
          <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] origin-left scale-x-0 rounded-full bg-[#b4ad9e] transition-transform group-hover:scale-x-100" />
        </div>
        {item.description && (
          <p className="mt-0.5 font-kalam text-[12px] leading-snug text-ink-muted/70 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      {item.meta && (
        <span className="mt-0.5 shrink-0 font-kalam text-[10px] text-ink-muted/60">
          {item.meta}
        </span>
      )}
    </button>
  );
}
SearchResultsItem.displayName = "SearchResults.Item";

export interface SearchResultsEmptyProps extends Omit<SearchEmptyProps, "className"> {
  className?: string;
}

function SearchResultsEmpty({
  title,
  description,
  suggestions,
  onSuggestionClick,
  className,
}: SearchResultsEmptyProps) {
  return (
    <div className={cn("p-4", className)}>
      <SearchEmpty
        title={title}
        description={description}
        suggestions={suggestions}
        onSuggestionClick={onSuggestionClick}
      />
    </div>
  );
}
SearchResultsEmpty.displayName = "SearchResults.Empty";

export const SearchResults = Object.assign(SearchResultsRoot, {
  Header: SearchResultsHeader,
  List: SearchResultsList,
  Item: SearchResultsItem,
  Empty: SearchResultsEmpty,
});
