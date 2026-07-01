import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, FileText, Layers, ListChecks, Workflow, Sparkles, Loader2, BookOpen, Tag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { PaperInput } from "@/paper-ui/components/inputs";
import { PaperSelect } from "@/paper-ui/components/inputs";
import { PaperBadge } from "@/paper-ui/components/badges";
import { ChipButton } from "@/paper-ui/components/buttons";
import { cn } from "@/paper-ui/utils";
import { api, type SearchResult } from "../lib/api";
import { type Course } from "../lib/types";

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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const requestId = useRef(0);

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LEN;

  useEffect(() => {
    api.listCourses().then(setCourses).catch(console.error);
  }, []);

  useEffect(() => {
    if (trimmed.length < MIN_QUERY_LEN) {
      setResults([]);
      setLoading(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    const handle = window.setTimeout(() => {
      api
        .search(trimmed, filter, courseFilter, topicFilter)
        .then((data) => {
          if (id !== requestId.current) return;
          setResults(data);
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          setResults([]);
          toast.error(err instanceof Error ? err.message : "Search failed");
        })
        .finally(() => {
          if (id === requestId.current) setLoading(false);
        });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [trimmed, filter, courseFilter, topicFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      (map[r.group] ??= []).push(r);
    });
    return map;
  }, [results]);

  const hasQuery = trimmed.length >= MIN_QUERY_LEN;

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
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 shrink-0 text-ink-muted" />
            <PaperSelect
              value={courseFilter}
              onChange={setCourseFilter}
              options={[
                { value: "all", label: "All Courses" },
                ...courses.map(c => ({ value: c.name, label: c.name })),
              ]}
              placeholder="Course"
            />
          </div>

          <div className="flex items-center gap-2">
            <Tag className="size-4 shrink-0 text-ink-muted" />
            <PaperInput
              value={topicFilter === "all" ? "" : topicFilter}
              onChange={e => setTopicFilter(e.target.value || "all")}
              placeholder="Filter by topic..."
            />
          </div>
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
        <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
          <SearchIcon className="size-8" />
          <p className="mt-3 text-sm">
            {tooShort
              ? `Type at least ${MIN_QUERY_LEN} characters to search.`
              : "Search semantically across your indexed documents."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => {
            const Icon = groupIcon[group] ?? FileText;
            return (
              <div key={group}>
                <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <Icon className="size-3.5" /> {group}
                </div>
                <div className="space-y-2">
                  {items.map((r, i) => (
                    <motion.button
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="block w-full rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate text-sm font-medium">{r.title}</span>
                        <PaperBadge tone="ink" className="shrink-0 text-xs">
                          {r.course}
                        </PaperBadge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {highlight(r.snippet, trimmed)}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}
          {!loading && results.length === 0 ? (
            <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
              <SearchIcon className="size-8" />
              <p className="mt-3 text-sm">No results for “{trimmed}”.</p>
            </div>
          ) : null}
        </div>
      )}
    </Page>
  );
}
