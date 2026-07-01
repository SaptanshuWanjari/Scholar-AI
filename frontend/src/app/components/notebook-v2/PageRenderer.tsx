// @ts-nocheck
import { FileText } from "lucide-react";
import { useNotebookV2Store } from "../../stores/useNotebookV2Store";
import type { V2Block } from "../../lib/notebook-v2.types";
import {
  BlockContainer,
  TextBlock,
  HeadingBlock,
  AiAnswerBlock,
  CodeBlock,
  CalloutBlock,
  TableBlock,
  ImageBlock,
  DiagramBlock,
  WhiteboardBlock,
  FlashdeckBlock,
  QuizResultsBlock,
} from "./blocks";

function renderBlockContent(block: V2Block, pageId: string) {
  switch (block.type) {
    case "heading": return <HeadingBlock block={block as V2Block<"heading">} pageId={pageId} />;
    case "text": return <TextBlock block={block as V2Block<"text">} pageId={pageId} />;
    case "ai-answer": return <AiAnswerBlock block={block as V2Block<"ai-answer">} pageId={pageId} />;
    case "code": return <CodeBlock block={block as V2Block<"code">} pageId={pageId} />;
    case "callout": return <CalloutBlock block={block as V2Block<"callout">} pageId={pageId} />;
    case "mermaid": return <DiagramBlock block={block as V2Block<"mermaid">} pageId={pageId} />;
    case "table": return <TableBlock block={block as V2Block<"table">} pageId={pageId} />;
    case "whiteboard": return <WhiteboardBlock block={block as V2Block<"whiteboard">} pageId={pageId} />;
    case "image": return <ImageBlock block={block as V2Block<"image">} pageId={pageId} />;
    case "flashdeck": return <FlashdeckBlock block={block as V2Block<"flashdeck">} pageId={pageId} />;
    case "quiz-results": return <QuizResultsBlock block={block as V2Block<"quiz-results">} pageId={pageId} />;
    default:
      return (
        <div className="rounded-md border border-tape/20 bg-paper/60 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/30">{block.type}</span>
          <pre className="mt-1 whitespace-pre-wrap text-sm text-ink/70">
            {JSON.stringify(block.content, null, 2).slice(0, 200)}
          </pre>
        </div>
      );
  }
}

export function PageRenderer({ pageId }: { pageId: string }) {
  const page = useNotebookV2Store((s) => s.notebook?.pages.find(p => p.id === pageId));

  if (!page || page.blocks.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-center">
        <FileText className="mb-3 size-10 text-ink/15" />
        <p className="font-caveat text-lg text-ink/30">This page is empty. Add a block to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 pb-20 pl-16 pr-8 pt-6">
      {page.blocks.map((block, idx) => (
        <div key={block.id} className="notebook-v2-block p-1">
          <BlockContainer block={block} pageId={pageId} index={idx}>
            {renderBlockContent(block, pageId)}
          </BlockContainer>
        </div>
      ))}
    </div>
  );
}
