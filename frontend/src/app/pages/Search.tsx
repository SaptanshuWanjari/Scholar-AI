import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Search as SearchIcon, FileText, Layers, ListChecks, Workflow, Sparkles, Loader2, BookOpen, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "@/app/lib/toast";
import { Page } from "../components/Page";
import { PaperInput } from "@/paper-ui/components/inputs";
import { PaperSelect } from "@/paper-ui/components/inputs";
import { PaperBadge } from "@/paper-ui/components/badges";
import { ChipButton } from "@/paper-ui/components/buttons";
import { PaperCard } from "@/paper-ui/core";
import { SearchResultRow } from "@/paper-ui/components/rows/SearchResultRow";
import { EmptyState } from "@/paper-ui/components/feedback/EmptyState";
import { cn } from "@/paper-ui/utils";
import { api, type SearchResult } from "../lib/api";

const groupIcon: Record<string, typeof FileText> = {
  Documents: FileText,
  Flashcards: Layers,
  Quizzes: ListChecks,
  Diagrams: Workflow,
};

const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Documents", value: "documents" },
  { label: "Flashcards", value: "flashcards" },
  { label: "Quizzes", value: "quizzes" },
  { label: "Diagrams", value: "diagrams" },
];

const MIN_QUERY_LEN = 2;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(snippet: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map(escapeRegExp);
  if (terms.length === 0) return snippet;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = snippet.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-violet-soft px-1 text-primary">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LEN;

  const { data: courses = [], error: coursesError } = useSWR("courses", () => api.listCourses());
  useEffect(() => {
    if (coursesError) toast.error("Failed to load courses");
  }, [coursesError]);

  const [debounceTick, setDebounceTick] = useState(0);
  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LEN) return;
    const timer = setTimeout(() => setDebounceTick((t) => t + 1), 300);
    return () => clearTimeout(timer);
  }, [trimmed, filter, courseFilter, topicFilter]);

  const hasQuery = trimmed.length >= MIN_QUERY_LEN;
  const searchKey = hasQuery
    ? ["search", trimmed, filter, courseFilter, topicFilter, debounceTick]
    : null;

  const { data: results = [], isLoading: loading, error: searchError } = useSWR(
    searchKey,
    () => api.search(trimmed, filter, courseFilter, topicFilter),
  );
  useEffect(() => {
    if (searchError) toast.error(searchError instanceof Error ? searchError.message : "Search failed");
  }, [searchError]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      (map[r.group] ??= []).push(r);
    });
    return map;
  }, [results]);

  return (
    <Page className="space-y-5">
      <div className="relative">
        <PaperInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Semantic search across all your knowledge…"
          icon={<SearchIcon className="size-5 text-ink-muted" />}
          trailingIcon={loading ? <Loader2 className="size-4 animate-spin text-ink-muted" /> : undefined}
          autoFocus
        />
        <PaperBadge tone="lavender" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <Sparkles className="size-3" /> Semantic
        </PaperBadge>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <PaperSelect
            value={courseFilter}
            onChange={setCourseFilter}
            options={[
              { value: "all", label: "All Courses" },
              ...courses.map(c => ({ value: c.name, label: c.name })),
            ]}
            placeholder="Course"
            icon={<BookOpen className="size-4 text-ink-muted" />}
          />

          <PaperInput
            value={topicFilter === "all" ? "" : topicFilter}
            onChange={e => setTopicFilter(e.target.value || "all")}
            placeholder="Filter by topic..."
            icon={<Tag className="size-4 text-ink-muted" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <ChipButton
              key={f.value}
              selected={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </ChipButton>
          ))}
          {hasQuery ? (
            <span className="ml-auto self-center text-sm text-ink-muted">
              {results.length} results
            </span>
          ) : null}
        </div>
      </div>

      {!hasQuery ? (
        <EmptyState
          icon={<SearchIcon size={32} className="text-ink-muted" />}
          title={tooShort ? "Query too short" : "Search everything"}
          description={
            tooShort
              ? `Type at least ${MIN_QUERY_LEN} characters to search.`
              : "Search semantically across your indexed documents."
          }
          className="my-12 max-w-lg mx-auto"
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => {
            const Icon = groupIcon[group] ?? FileText;
            return (
              <PaperCard key={group} className="p-4">
                <div className="mb-3 pb-2 border-b border-border/40 flex items-center gap-2 text-sm font-architect text-ink-muted">
                  <Icon className="size-4 text-[#4a6f91]" /> {group}
                </div>
                <div className="divide-y divide-border/30">
                  {items.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <SearchResultRow
                        title={r.title}
                        snippet={highlight(r.snippet, trimmed)}
                        badge={
                          r.course && (
                            <PaperBadge tone="ink" className="text-xs">
                              {r.course}
                            </PaperBadge>
                          )
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </PaperCard>
            );
          })}
          {!loading && results.length === 0 ? (
            <EmptyState
              icon={<SearchIcon size={32} className="text-ink-muted" />}
              title="No results found"
              description={`We couldn't find any results for "${trimmed}".`}
              className="my-12 max-w-lg mx-auto"
            />
          ) : null}
        </div>
      )}
    </Page>
  );
}
