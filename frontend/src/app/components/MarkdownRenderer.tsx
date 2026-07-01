import { Children, isValidElement, type ReactNode, cloneElement, memo, useMemo, lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { CitationBadge } from "./CitationBadge";
import { DiagramViewer } from "./DiagramViewer";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogClose } from "./ui/dialog";
import { cn } from "./ui/utils";
import { usePluginStore } from "../plugins/usePluginStore";
import type { Components } from "react-markdown";
import { useNavigate } from "react-router";

const LazyPlantUMLViewer = lazy(() =>
  import("../plugins/plantuml/PlantUMLViewer").then((m) => ({ default: m.PlantUMLViewer }))
);

interface MarkdownRendererProps {
  content: string;
  onCitationClick?: (index: number) => void;
  className?: string;
}

const LazySyntaxHighlighter = lazy(async () => {
  const { PrismLight } = await import('react-syntax-highlighter');
  const [
    python,
    javascript,
    typescript,
    jsx,
    tsx,
    css,
    bash,
    markdown,
    prism
  ] = await Promise.all([
    import('react-syntax-highlighter/dist/esm/languages/prism/python').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/javascript').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/typescript').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/jsx').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/tsx').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/css').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/bash').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/languages/prism/markdown').then(m => m.default),
    import('react-syntax-highlighter/dist/esm/styles/prism/prism').then(m => m.default)
  ]);

  PrismLight.registerLanguage('python', python);
  PrismLight.registerLanguage('javascript', javascript);
  PrismLight.registerLanguage('typescript', typescript);
  PrismLight.registerLanguage('jsx', jsx);
  PrismLight.registerLanguage('tsx', tsx);
  PrismLight.registerLanguage('css', css);
  PrismLight.registerLanguage('bash', bash);
  PrismLight.registerLanguage('markdown', markdown);

  return { 
    default: function Highlight(props: any) {
      return <PrismLight style={prism} {...props} />;
    } 
  };
});

function withMathAndCitations(
  children: ReactNode,
  onCitationClick?: (index: number) => void,
): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "string") {
      const regex = /(\[\d+\])/g;
      const parts = child.split(regex);
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
    
    if (isValidElement(child)) {
      const { children: elementChildren } = child.props as { children?: ReactNode };
      if (elementChildren) {
        return cloneElement(child, {
          ...(child.props as Record<string, unknown>),
          children: withMathAndCitations(elementChildren, onCitationClick),
        } as any);
      }
      return child;
    }
    
    return child;
  });
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  onCitationClick,
  className,
}: MarkdownRendererProps) {
  const plantumlEnabled = usePluginStore((s) => s.isEnabled("plantuml"));
  const navigate = useNavigate();
  const remarkPlugins = useMemo(() => [remarkBreaks, remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeRaw, rehypeKatex], []);

  const components: Components = useMemo(() => ({
    h1: ({ children }) => (
      <h1 className="font-caveat text-[32px] font-bold text-ink mb-3 mt-6 first:mt-0">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-caveat text-[26px] font-semibold text-ink mb-3 mt-5 first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-kalam text-[18px] font-bold text-ink mb-2 mt-4 first:mt-0">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="font-kalam text-[14.5px] leading-relaxed text-ink mb-4">
        {withMathAndCitations(children, onCitationClick)}
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
    li: ({ children, className }) => {
      if (className && className.includes("task-list-item")) {
        return (
          <li className={cn("relative flex items-center gap-3 pl-1 mb-2 font-kalam text-[14.5px] text-ink", className)}>
            <span className="flex-1 flex items-center">
              {withMathAndCitations(children, onCitationClick)}
            </span>
          </li>
        );
      }
      return (
        <li className="relative flex gap-3 pl-1 mb-2 font-kalam text-[14.5px] text-ink">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[#3a3733]" />
          <span className="flex-1">
            {withMathAndCitations(children, onCitationClick)}
          </span>
        </li>
      );
    },
    input: ({ type, checked, disabled, ...props }) => {
      if (type === "checkbox") {
        return (
          <input
            type="checkbox"
            defaultChecked={checked}
            className="mr-2 rounded border-border text-violet focus:ring-violet mt-1"
            {...props}
          />
        );
      }
      return <input type={type} checked={checked} disabled={disabled} {...props} />;
    },
    img: ({ src, alt }) => (
      <figure className="my-4">
        <Dialog>
          <DialogTrigger asChild>
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              loading="lazy"
              className="mx-auto max-h-[28rem] cursor-zoom-in rounded-lg border border-border object-contain transition-opacity hover:opacity-90"
            />
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] h-[95vh] border-none bg-transparent p-0 shadow-none">
            <DialogTitle className="sr-only">{alt ?? "Image view"}</DialogTitle>
            <DialogClose asChild>
              <div className="w-full h-full flex items-center justify-center cursor-zoom-out">
                <img
                  src={typeof src === "string" ? src : ""}
                  alt={alt ?? ""}
                  className="h-auto max-h-[95vh] w-auto max-w-full rounded-lg object-contain cursor-default"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </DialogClose>
          </DialogContent>
        </Dialog>
        {alt && alt !== "Image" && (
          <figcaption className="mt-2 text-center text-xs italic text-muted-foreground">
            {alt}
          </figcaption>
        )}
      </figure>
    ),
    a: ({ children, href }) => {
      // Handle #doc{id}-p{page} anchors from sticky notes
      const match = href?.match(/^#doc(\d+)-p(\d+)$/);
      if (match) {
        const [, docId, page] = match;
        return (
          <a
            href={href}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/reading/${docId}?page=${page}`);
            }}
            className="text-cyan underline-offset-2 hover:underline cursor-pointer"
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          className="text-cyan underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-4 rounded-r-lg border-l-2 border-primary bg-violet-soft/40 py-2 pl-4 pr-3 italic text-foreground/80">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    code: ({ className: cls, children }) => {
      const isBlock = /language-/.test(cls ?? "") || String(children).includes("\n");
      const language = cls?.replace("language-", "") || "";
      
      if (language === "mermaid") {
        return <DiagramViewer code={String(children).replace(/\n$/, "")} />;
      }

      if (language === "plantuml" && plantumlEnabled) {
        return (
          <Suspense fallback={<div className="my-4 h-48 animate-pulse rounded-lg bg-muted" />}>
            <LazyPlantUMLViewer code={String(children).replace(/\n$/, "")} />
          </Suspense>
        );
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
          <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 z-10">
            <div className="rounded border border-border bg-card px-2 py-1 text-[10px] text-muted-foreground">
              {language}
            </div>
          </div>
          <Suspense fallback={<pre className="overflow-x-auto rounded-lg border border-border bg-secondary p-4"><code className="font-mono text-[13px] leading-relaxed text-foreground/90">{children}</code></pre>}>
            <LazySyntaxHighlighter language={language} PreTag="div" customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.5rem', fontSize: '13px', backgroundColor: 'var(--color-secondary)' }}>
              {String(children).replace(/\n$/, "")}
            </LazySyntaxHighlighter>
          </Suspense>
        </div>
      );
    },
    pre: ({ children }) => <>{children}</>,
    table: ({ children }) => (
      <div className="mb-4 overflow-x-auto w-full relative z-[1]">
        <table className="w-full border-collapse text-left">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b-2 border-[#3a3733]">{children}</thead>
    ),
    tr: ({ children }) => (
      <tr className="transition-colors hover:bg-black/[0.015]">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="font-architect text-[14px] font-bold text-ink-muted uppercase tracking-wide px-4 py-3 text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 font-kalam text-[14.5px] leading-relaxed text-ink border-b border-[#e8e3d8]">
        {withMathAndCitations(children, onCitationClick)}
      </td>
    ),
    hr: () => <hr className="my-6 border-[#e8e3d8]" />,
  }), [onCitationClick, plantumlEnabled]);

  return (
    <div
      className={cn(
        "markdown-content max-w-none font-reading text-[16.5px] leading-[1.75] text-foreground/90",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins as any}
        rehypePlugins={rehypePlugins as any}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
