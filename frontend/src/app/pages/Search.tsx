import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, FileText, Layers, ListChecks, Workflow, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Page } from "../components/Page";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { api, type SearchResult } from "../lib/api";
import { cn } from "../components/ui/utils";

const groupIcon: Record<string, typeof FileText> = {
  Documents: FileText,
  Flashcards: Layers,
  Quizzes: ListChecks,
  Diagrams: Workflow,
};

// UI label -> backend filter value. Only "all"/"documents" return data in v1.
const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Documents", value: "documents" },
  { label: "Flashcards", value: "flashcards" },
  { label: "Quizzes", value: "quizzes" },
  { label: "Diagrams", value: "diagrams" },
];

// Filters with no backend data yet — show a "coming soon" empty state.
const unindexedFilters = new Set(["flashcards", "quizzes", "diagrams"]);

const MIN_QUERY_LEN = 2;

// Escape regex metacharacters so user input can't break the highlighter.
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Client-side highlight of query terms in a plain-text snippet.
function highlight(snippet: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map(escapeRegExp);
  if (terms.length === 0) return snippet;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  // String.split with a capturing group yields alternating [text, match, text, …],
  // so odd indices are the captured matches.
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Guards against out-of-order responses clobbering newer ones.
  const requestId = useRef(0);

  const trimmed = query.trim();
  const tooShort = trimmed.length > 0 && trimmed.length < MIN_QUERY_LEN;
  const isUnindexed = unindexedFilters.has(filter);

  useEffect(() => {
    // Don't hit the backend for empty/too-short queries or unindexed filters.
    if (trimmed.length < MIN_QUERY_LEN || isUnindexed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    const handle = window.setTimeout(() => {
      api
        .search(trimmed, filter)
        .then((data) => {
          if (id !== requestId.current) return; // stale response
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
  }, [trimmed, filter, isUnindexed]);

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
        <SearchIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Semantic search across all your knowledge…"
          className="h-12 bg-input-background pl-12 text-base"
          autoFocus
        />
        {loading ? (
          <Loader2 className="absolute right-32 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
        <Badge variant="outline" className="absolute right-3 top-1/2 -translate-y-1/2 gap-1 border-primary/40 bg-violet-soft text-primary">
          <Sparkles className="size-3" /> Semantic
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
        {hasQuery && !isUnindexed ? (
          <span className="ml-auto self-center text-sm text-muted-foreground">
            {results.length} results
          </span>
        ) : null}
      </div>

      {/* Unindexed filter (flashcards/quizzes/diagrams) — not yet searchable. */}
      {isUnindexed ? (
        <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
          <Sparkles className="size-8" />
          <p className="mt-3 text-sm">Coming soon — not yet indexed.</p>
        </div>
      ) : !hasQuery ? (
        // Empty / suggestions state.
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
                        <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
                          {r.course}
                        </Badge>
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
