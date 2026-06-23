import { Children, isValidElement, type ReactNode, cloneElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CitationBadge } from "./CitationBadge";
import { DiagramViewer } from "./DiagramViewer";
import { cn } from "./ui/utils";

interface MarkdownRendererProps {
  content: string;
  onCitationClick?: (index: number) => void;
  className?: string;
}

/** 
 * Recursive function to replace [n] tokens inside a React tree with citation badges.
 * This handles nested structures like **text [1]** or *text [2]*.
 */
function withCitations(
  children: ReactNode,
  onCitationClick?: (index: number) => void,
): ReactNode {
  return Children.map(children, (child) => {
    // If it's a string, we perform the regex replacement
    if (typeof child === "string") {
      const parts = child.split(/(\[\d+\])/g);
      return parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        if (m) {
          return (
            <CitationBadge
              key={i}
              index={Number(m[1])}
              onClick={onCitationClick}
            />
          );
        }
        return part;
      });
    }
    
    // If it's a React element, we recurse into its children
    if (isValidElement(child)) {
      const { children: elementChildren } = child.props as { children?: ReactNode };
      if (elementChildren) {
        return cloneElement(child, {
          ...child.props,
          children: withCitations(elementChildren, onCitationClick),
        } as any);
      }
      return child;
    }
    
    return child;
  });
}

export function MarkdownRenderer({
  content,
  onCitationClick,
  className,
}: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "markdown-content max-w-none font-reading text-[16.5px] leading-[1.75] text-foreground/90",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-7 first:mt-0 text-xl">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 first:mt-0 text-lg">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 leading-7">
              {withCitations(children, onCitationClick)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-1 space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-1 list-none space-y-2 [counter-reset:item]">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            return (
              <li className="relative flex gap-3 pl-1 mb-2">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
                <span className="flex-1">
                  {withCitations(children, onCitationClick)}
                </span>
              </li>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-cyan underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-lg border-l-2 border-primary bg-violet-soft/40 py-2 pl-4 pr-3 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          code: ({ className: cls, children }) => {
            const isBlock = /language-/.test(cls ?? "");
            const language = cls?.replace("language-", "") || "";
            
            if (language === "mermaid") {
              return <DiagramViewer code={String(children).replace(/\n$/, "")} />;
            }

            if (!isBlock) {
              return (
                <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-cyan">
                  {children}
                </code>
              );
            }
            
            return (
              <div className="group relative my-4">
                <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground">
                    {language}
                  </div>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4">
                  <code className="font-mono text-[13px] leading-relaxed text-foreground/90">
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          pre: ({ children }) => <>{children}</>, // Handled in code component
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/60">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-border px-4 py-2.5 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-4 py-2.5 text-foreground/80">
              {withCitations(children, onCitationClick)}
            </td>
          ),
          hr: () => <hr className="my-6 border-border" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
