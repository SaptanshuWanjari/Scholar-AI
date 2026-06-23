import { useMemo, useState } from "react";
import { Search as SearchIcon, FileText, Layers, ListChecks, Workflow, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Page } from "../components/Page";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { searchResults } from "../lib/mock-data";
import { cn } from "../components/ui/utils";

const groupIcon: Record<string, typeof FileText> = {
  Documents: FileText,
  Flashcards: Layers,
  Quizzes: ListChecks,
  Diagrams: Workflow,
};

const filters = ["All", "Documents", "Flashcards", "Quizzes", "Diagrams"];

export function SearchPage() {
  const [query, setQuery] = useState("gradient");
  const [filter, setFilter] = useState("All");

  const results = useMemo(
    () =>
      searchResults.filter(
        (r) =>
          (filter === "All" || r.group === filter) &&
          (query === "" ||
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.snippet.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, filter],
  );

  const grouped = useMemo(() => {
    const map: Record<string, typeof results> = {};
    results.forEach((r) => {
      (map[r.group] ??= []).push(r);
    });
    return map;
  }, [results]);

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
        <Badge variant="outline" className="absolute right-3 top-1/2 -translate-y-1/2 gap-1 border-primary/40 bg-violet-soft text-primary">
          <Sparkles className="size-3" /> Semantic
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              filter === f
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-muted-foreground">
          {results.length} results
        </span>
      </div>

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
                    <p
                      className="mt-1 text-sm leading-relaxed text-muted-foreground [&_mark]:rounded [&_mark]:bg-violet-soft [&_mark]:px-1 [&_mark]:text-primary"
                      dangerouslySetInnerHTML={{ __html: r.snippet }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
        {results.length === 0 && (
          <div className="flex flex-col items-center pt-16 text-center text-muted-foreground">
            <SearchIcon className="size-8" />
            <p className="mt-3 text-sm">No results for “{query}”.</p>
          </div>
        )}
      </div>
    </Page>
  );
}
