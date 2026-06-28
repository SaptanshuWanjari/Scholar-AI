import { useMemo, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";
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

export function Guide() {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Active section management via hash
  const activeSectionId = useMemo(() => {
    const hash = location.hash.slice(1);
    if (hash) {
      // Check if hash matches a section
      const section = guideSections.find((s) => s.id === hash);
      if (section) return section.id;
      // Check if hash matches an article, if so find its parent section
      const parentSection = guideSections.find((s) =>
        s.articles.some((a) => a.id === hash)
      );
      if (parentSection) return parentSection.id;
    }
    return guideSections[0].id;
  }, [location.hash]);

  const activeArticleId = useMemo(() => {
    const hash = location.hash.slice(1);
    const isArticle = guideSections.some((s) =>
      s.articles.some((a) => a.id === hash)
    );
    return isArticle ? hash : null;
  }, [location.hash]);

  const goToSection = (id: string) => {
    navigate(`#${id}`);
    window.document.getElementById("guide-content-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToArticle = (id: string) => {
    navigate(`#${id}`);
    // Delay scroll slightly to allow React to render the target article if we just switched sections
    setTimeout(() => {
      window.document.getElementById(`guide-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

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

  const activeSection = filtered.find((s) => s.id === activeSectionId) || filtered[0];

  const onContentClick = (e: MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const targetId = href.slice(1);
      
      const isSection = guideSections.some(s => s.id === targetId);
      if (isSection) {
        goToSection(targetId);
      } else {
        goToArticle(targetId);
      }
    }
  };

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar Navigation */}
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
            <p className="px-2 py-4 text-sm text-muted-foreground">No matches.</p>
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
                  <AccordionTrigger 
                    className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline"
                    onClick={(e) => {
                      // If user clicks the trigger, we don't just toggle accordion, we navigate to the section
                      e.preventDefault();
                      goToSection(section.id);
                    }}
                  >
                    <span className={activeSectionId === section.id ? "text-violet font-bold" : ""}>
                      {section.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1">
                    <ul className="space-y-0.5">
                      {section.articles.map((a) => {
                        const isActive = activeArticleId === a.id;
                        return (
                          <li key={a.id}>
                            <button
                              onClick={() => goToArticle(a.id)}
                              className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/50 ${
                                isActive
                                  ? "bg-violet-soft text-violet font-medium"
                                  : "text-foreground/80 hover:text-foreground"
                              }`}
                            >
                              {a.title}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </nav>
      </aside>

      {/* Content Area */}
      <div
        id="guide-content-scroll"
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth bg-background/50"
        onClick={onContentClick}
      >
        <div className="mx-auto w-full max-w-4xl px-6 py-8 md:py-12">
          <header className="mb-10 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-soft text-primary shadow-sm">
                <BookOpen className="size-5 text-violet" />
              </div>
              <h1 className="text-3xl font-display font-semibold">ScholarAI Guide</h1>
            </div>
            <p className="text-base font-book text-muted-foreground ml-13">
              Everything you need to study smarter — searchable and organized.
            </p>
          </header>

          {/* Mobile search */}
          <div className="relative mb-8 md:hidden">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the guide…"
              aria-label="Search the guide"
              className="pl-9"
            />
          </div>

          {filtered.length === 0 || !activeSection ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </p>
          ) : (() => {
            const activeIndex = filtered.findIndex((s) => s.id === activeSection.id);
            const prevSection = activeIndex > 0 ? filtered[activeIndex - 1] : null;
            const nextSection = activeIndex >= 0 && activeIndex < filtered.length - 1 ? filtered[activeIndex + 1] : null;
            return (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="mb-8 text-4xl font-display font-bold text-foreground border-b border-border pb-4">
                {activeSection.title}
              </h2>
              
              <div className="space-y-12">
                {activeSection.articles.map((a) => (
                  <article 
                    key={a.id} 
                    id={`guide-${a.id}`} 
                    className={`scroll-mt-6 flex flex-col transition-all rounded-md p-4 border border-transparent ${
                      activeArticleId === a.id ? "ring-2 ring-violet bg-muted/10" : ""
                    }`}
                  >
                    <h3 className="mb-4 text-2xl font-display font-semibold text-foreground">
                      {a.title}
                    </h3>
                    <div className="w-full">
                      <MarkdownRenderer
                        content={a.body}
                        className="
                          text-lg font-book leading-relaxed text-muted-foreground
                          prose-p:mb-5 last:prose-p:mb-0
                          prose-strong:font-semibold prose-strong:text-foreground
                          prose-a:text-violet prose-a:font-medium hover:prose-a:underline
                          prose-blockquote:border-l-4 prose-blockquote:border-violet 
                          prose-blockquote:bg-violet-soft/30 prose-blockquote:py-3 prose-blockquote:px-5 
                          prose-blockquote:rounded-r-md prose-blockquote:my-5 prose-blockquote:not-italic
                          prose-blockquote:text-foreground/90 prose-blockquote:shadow-sm
                        "
                      />
                    </div>
                  </article>
                ))}
              </div>
              
              {(prevSection || nextSection) && (
                <div className="mt-20 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prevSection ? (
                    <button
                      onClick={() => goToSection(prevSection.id)}
                      className="group block rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-violet/30 hover:bg-violet-soft/10 hover:shadow-sm"
                    >
                      <h4 className="mb-2 text-xl font-semibold text-foreground group-hover:text-violet">
                        <span className="mr-1 inline-block transition-transform group-hover:-translate-x-1">&larr;</span> {prevSection.title}
                      </h4>
                      <p className="text-sm font-book text-muted-foreground line-clamp-1">
                        {prevSection.articles.map(a => a.title).join(", ")}
                      </p>
                    </button>
                  ) : <div />}
                  
                  {nextSection ? (
                    <button
                      onClick={() => goToSection(nextSection.id)}
                      className="group block rounded-xl border border-border bg-card p-6 text-right transition-all hover:border-violet/30 hover:bg-violet-soft/10 hover:shadow-sm"
                    >
                      <h4 className="mb-2 text-xl font-semibold text-foreground group-hover:text-violet">
                        {nextSection.title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                      </h4>
                      <p className="text-sm font-book text-muted-foreground line-clamp-1">
                        {nextSection.articles.map(a => a.title).join(", ")}
                      </p>
                    </button>
                  ) : <div />}
                </div>
              )}
            </section>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
