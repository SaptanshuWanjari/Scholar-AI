import { useMemo, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Search, BookOpen } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/paper-ui/components/navigation";
import { PaperInput } from "@/paper-ui/components/inputs";
import { GhostButton } from "@/paper-ui/components/buttons";
import { PaperPanel, PaperIconCircle, PaperH1, PaperH2, PaperH3, PaperH4 } from "@/paper-ui/core";
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
          <PaperInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the guide…"
            icon={<Search className="size-4 text-ink-muted" />}
            aria-label="Search the guide"
          />
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-4 font-architect text-sm text-ink-muted">No matches.</p>
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
                              <GhostButton
                                size="sm"
                                border={null}
                                onClick={() => goToArticle(a.id)}
                                className={`w-full justify-start rounded-md text-left ${
                                  isActive
                                    ? "bg-violet-soft text-violet font-medium"
                                    : "text-foreground/80 hover:text-foreground"
                                }`}
                              >
                                {a.title}
                              </GhostButton>
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
              <PaperIconCircle tone="lavender" size={40}>
                <BookOpen className="size-5" />
              </PaperIconCircle>
              <PaperH1>ScholarAI Guide</PaperH1>
            </div>
            <p className="font-architect text-base text-ink-muted ml-13">
              Everything you need to study smarter — searchable and organized.
            </p>
          </header>

          <div className="mb-8 md:hidden">
            <PaperInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the guide…"
              icon={<Search className="size-4 text-ink-muted" />}
              aria-label="Search the guide"
            />
          </div>

          {filtered.length === 0 || !activeSection ? (
            <p className="font-architect py-12 text-center text-sm text-ink-muted">
              No results for “{query}”.
            </p>
          ) : (() => {
            const activeIndex = filtered.findIndex((s) => s.id === activeSection.id);
            const prevSection = activeIndex > 0 ? filtered[activeIndex - 1] : null;
            const nextSection = activeIndex >= 0 && activeIndex < filtered.length - 1 ? filtered[activeIndex + 1] : null;
            return (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PaperH2 className="mb-8 border-b border-[#e8e3d8] pb-4 font-caveat text-[32px]">
                {activeSection.title}
              </PaperH2>
              
              <div className="space-y-12">
                {activeSection.articles.map((a) => (
                  <article 
                    key={a.id} 
                    id={`guide-${a.id}`} 
                    className={`scroll-mt-6 flex flex-col transition-all rounded-md p-4 ${
                      activeArticleId === a.id ? "bg-ink/5" : ""
                    }`}
                  >
                    <PaperH3 className="mb-4">{a.title}</PaperH3>
                    <div className="w-full">
                      <MarkdownRenderer
                        content={a.body}
                        className="
                          font-architect text-[20px] leading-relaxed text-ink-muted
                          prose-p:mb-5 last:prose-p:mb-0
                          prose-strong:font-semibold prose-strong:text-ink
                          prose-a:text-violet prose-a:font-medium hover:prose-a:underline
                          prose-blockquote:border-l-4 prose-blockquote:border-violet 
                          prose-blockquote:bg-violet-soft/30 prose-blockquote:py-3 prose-blockquote:px-5 
                          prose-blockquote:rounded-r-md prose-blockquote:my-5 prose-blockquote:not-italic
                          prose-blockquote:text-ink/90 prose-blockquote:shadow-sm
                        "
                      />
                    </div>
                  </article>
                ))}
              </div>
              
              {(prevSection || nextSection) && (
                <div className="mt-20 pt-10 border-t border-[#e8e3d8] grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prevSection ? (
                    <PaperPanel
                      shadow="sm"
                      lift
                      onClick={() => goToSection(prevSection.id)}
                      className="cursor-pointer p-6 text-left"
                    >
                      <PaperH4 className="mb-2 flex items-center gap-2">
                        <span className="transition-transform group-hover:-translate-x-1">&larr;</span> {prevSection.title}
                      </PaperH4>
                      <p className="font-architect text-sm text-ink-muted line-clamp-1">
                        {prevSection.articles.map(a => a.title).join(", ")}
                      </p>
                    </PaperPanel>
                  ) : <div />}
                  
                  {nextSection ? (
                    <PaperPanel
                      shadow="sm"
                      lift
                      onClick={() => goToSection(nextSection.id)}
                      className="cursor-pointer p-6 text-right"
                    >
                      <PaperH4 className="mb-2 flex items-center justify-end gap-2">
                        {nextSection.title} <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                      </PaperH4>
                      <p className="font-architect text-sm text-ink-muted line-clamp-1">
                        {nextSection.articles.map(a => a.title).join(", ")}
                      </p>
                    </PaperPanel>
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
