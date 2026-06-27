import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { Search, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { Input } from "../components/ui/input";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { guideSections, type GuideArticle } from "../guidance/guideContent";

function scrollToArticle(id: string) {
  document
    .getElementById(`guide-${id}`)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Layer 4 — the comprehensive in-app Guide. Searchable, with a section/article
 *  sidebar, expandable sections, internal cross-links, and markdown bodies. */
export function Guide() {
  const [query, setQuery] = useState("");
  // Briefly flash a freshly-navigated article's title to draw the eye to it.
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToArticle = (id: string) => {
    scrollToArticle(id);
    setHighlightId(id);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setHighlightId(null), 1400);
  };

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    []
  );

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return guideSections;
    const match = (a: GuideArticle) =>
      a.title.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q) ||
      (a.keywords ?? []).some((k) => k.toLowerCase().includes(q));
    return guideSections
      .map((s) => ({ ...s, articles: s.articles.filter(match) }))
      .filter((s) => s.articles.length > 0);
  }, [q]);

  // Intercept internal `#article-id` links inside rendered markdown so they
  // scroll within the Guide's own scroll container.
  const onContentClick = (e: MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      goToArticle(href.slice(1));
    }
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar: search + section/article navigation */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border md:flex">
        <div className="border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the guide…"
              aria-label="Search the guide"
              className="pl-9"
            />
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              No matches.
            </p>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={guideSections.map((s) => s.id)}
            >
              {filtered.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border-none"
                >
                  <AccordionTrigger className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <ul className="space-y-0.5">
                      {section.articles.map((a) => (
                        <li key={a.id}>
                          <button
                            onClick={() => goToArticle(a.id)}
                            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-foreground/80 transition-colors hover:bg-accent/50 hover:text-foreground"
                          >
                            {a.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </nav>
      </aside>

      {/* Content */}
      <div
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth"
        onClick={onContentClick}
      >
        <div className="mx-auto w-full max-w-3xl px-6 py-8">
          <header className="mb-8 flex items-center gap-3 border-b border-border pb-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-soft text-primary">
              <BookOpen className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-semibold">ScholarAI Guide</h1>
              <p className="text-base font-book text-muted-foreground">
                Everything you need to study smarter — searchable and organized.
              </p>
            </div>
          </header>

          {/* Mobile search */}
          <div className="relative mb-6 md:hidden">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the guide…"
              aria-label="Search the guide"
              className="pl-9"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </p>
          ) : (
            <div className="space-y-12">
              {filtered.map((section) => (
                <section key={section.id} id={`guide-section-${section.id}`}>
                  <h2 className="mb-6 text-3xl font-display font-bold uppercase tracking-widest text-muted-foreground/80">
                    {section.title}
                  </h2>
                  <div className="space-y-8">
                    {section.articles.map((a) => (
                      <article
                        key={a.id}
                        id={`guide-${a.id}`}
                        className="scroll-mt-6"
                      >
                        <h3
                          className={
                            "mb-3 -mx-2 rounded-md px-2 text-2xl font-display font-semibold text-foreground transition-colors duration-700 " +
                            (highlightId === a.id
                              ? "bg-violet-soft text-primary"
                              : "bg-transparent")
                          }
                        >
                          {a.title}
                        </h3>
                        <MarkdownRenderer
                          content={a.body}
                          className="text-lg font-book leading-relaxed text-muted-foreground"
                        />
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
