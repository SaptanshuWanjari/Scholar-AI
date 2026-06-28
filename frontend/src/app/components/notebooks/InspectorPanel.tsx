import { ChevronRight, FileText, Gauge, Info, PanelRightClose } from "lucide-react";
import { cn } from "../ui/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { NotebookBlock } from "../../lib/notebook-data";
import { blockOutlineLevel, blockLabel } from "./utils";

function InspectorBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {children}
    </div>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-0.5 text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="font-display text-2xl leading-none">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

interface NotebookDetails {
  details: { notebook: string; type: string; created: string };
  wordCount: number;
  readingTime: string;
  linkedSources: string[];
  generatedAssets: { label: string; count: number }[];
  relatedTopics: string[];
  revisionStatus: string;
}

export function InspectorPanel({
  inspector,
  blocks,
  collapsedBlocks,
  panelCollapsed,
  onJumpToBlock,
  onToggleCollapse,
}: {
  inspector: NotebookDetails | null;
  blocks: NotebookBlock[];
  collapsedBlocks: Set<number>;
  panelCollapsed: boolean;
  onJumpToBlock: (i: number) => void;
  onToggleCollapse: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-y-auto border-l border-border bg-card/40 transition-all duration-300 xl:flex",
        panelCollapsed ? "w-0 border-l-0" : "w-[300px]",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Inspector
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={onToggleCollapse}
        >
          <PanelRightClose className="size-4" />
        </Button>
      </div>

      {inspector ? (
        <div className="space-y-5 p-4">
          {blocks.length > 0 && (
            <InspectorBlock title="Outline">
              <div className="-mx-1 space-y-0.5">
                {blocks.map((b, i) => {
                  const level = blockOutlineLevel(b);
                  return (
                    <button
                      key={i}
                      onClick={() => onJumpToBlock(i)}
                      className={cn(
                        "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-accent/60",
                        level === 0 && "font-semibold text-foreground",
                        level === 1 && "font-medium text-foreground/90",
                        level === 2 &&
                          "pl-4 text-[13px] text-muted-foreground",
                      )}
                      title={blockLabel(b)}
                    >
                      {collapsedBlocks.has(i) ? (
                        <ChevronRight className="size-3 shrink-0 opacity-50" />
                      ) : (
                        <span className="size-3 shrink-0" />
                      )}
                      <span className="truncate">{blockLabel(b)}</span>
                    </button>
                  );
                })}
              </div>
            </InspectorBlock>
          )}

          <InspectorBlock title="Notebook Details">
            <MetaRow k="Notebook" v={inspector.details.notebook} />
            <MetaRow k="Course" v={inspector.details.type} />
            <MetaRow k="Updated" v={inspector.details.created} />
          </InspectorBlock>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Words" value={inspector.wordCount} />
            <Stat label="Reading" value={inspector.readingTime} />
          </div>

          {inspector.linkedSources.length > 0 && (
            <InspectorBlock title="Linked Sources">
              {inspector.linkedSources.map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-2 py-1 text-sm text-foreground/80"
                >
                  <FileText className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <span className="leading-snug">{s}</span>
                </div>
              ))}
            </InspectorBlock>
          )}

          {inspector.generatedAssets.length > 0 && (
            <InspectorBlock title="Generated Assets">
              <div className="grid grid-cols-2 gap-2">
                {inspector.generatedAssets.map((a) => (
                  <div
                    key={a.label}
                    className="rounded-lg border border-border bg-card px-3 py-2"
                  >
                    <div className="font-display text-xl leading-none">
                      {a.count}
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">
                      {a.label}
                    </div>
                  </div>
                ))}
              </div>
            </InspectorBlock>
          )}

          {inspector.relatedTopics.length > 0 && (
            <InspectorBlock title="Related Topics">
              <div className="flex flex-wrap gap-1.5">
                {inspector.relatedTopics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-foreground/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </InspectorBlock>
          )}

          <InspectorBlock title="Revision Status">
            <Badge
              variant="outline"
              className="gap-1.5 border-warning/40 bg-warning-soft text-warning"
            >
              <Gauge className="size-3" /> {inspector.revisionStatus}
            </Badge>
          </InspectorBlock>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground mt-10">
          <Info className="size-8 opacity-20 mb-3" />
          <p className="text-sm">Select a notebook to view its details.</p>
        </div>
      )}
    </aside>
  );
}
