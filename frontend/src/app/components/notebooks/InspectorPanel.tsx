import { ChevronRight, FileText, Gauge, Info, PanelRightClose } from "lucide-react";
import { cn } from "@/paper-ui/utils";
import { PaperCard, SectionHeader } from "@/paper-ui/core";
import { IconButton } from "@/paper-ui/components/buttons";
import { PaperStamp } from "@/paper-ui/components/decorations";
import type { NotebookBlock } from "../../lib/notebook-data";
import { blockOutlineLevel, blockLabel } from "./utils";

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 font-architect text-sm">
      <span className="text-ink-muted shrink-0">{k}</span>
      <span className="font-medium text-ink text-right break-words">{v}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <PaperCard shadow="sm" surface="#fffdf9" border={{ strokeWidth: 1.2, roughness: 1.1 }}>
      <div className="px-4 py-3 text-center">
        <div className="font-caveat text-[28px] leading-none text-ink">{value}</div>
        <div className="mt-1 font-architect text-[11px] uppercase tracking-[0.12em] text-ink-muted">{label}</div>
      </div>
    </PaperCard>
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
  if (panelCollapsed) {
    return (
      <aside className="hidden shrink-0 w-0 border-l-0 overflow-hidden transition-all duration-300 xl:flex" />
    );
  }

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col overflow-y-auto py-6 paper-scrollbar transition-all duration-300 xl:flex w-[300px]",
      )}
      style={{ borderLeft: "1.5px solid #c8c0b0" }}
    >
      <div className="flex items-center justify-between px-4 pb-3 border-b border-ink-muted/15">
        <span className="font-architect text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          Inspector
        </span>
        <IconButton label="Collapse inspector" onClick={onToggleCollapse}>
          <PanelRightClose className="size-4" />
        </IconButton>
      </div>

      {inspector ? (
        <div className="space-y-6 px-4 pt-4">
          {blocks.length > 0 && (
            <div>
              <SectionHeader title="Outline" marker />
              <div className="-mx-1 space-y-0.5">
                {blocks.map((b, i) => {
                  const level = blockOutlineLevel(b);
                  return (
                    <button
                      key={i}
                      onClick={() => onJumpToBlock(i)}
                      className={cn(
                        "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left transition-colors hover:bg-ink/[0.04]",
                        level === 0 && "font-caveat text-[17px] font-semibold text-ink",
                        level === 1 && "font-kalam text-[14px] font-medium text-ink/90",
                        level === 2 && "pl-4 font-architect text-[13px] text-ink-muted",
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
            </div>
          )}

          <div>
            <SectionHeader title="Details" marker />
            <MetaRow k="Notebook" v={inspector.details.notebook} />
            <MetaRow k="Course" v={inspector.details.type} />
            <MetaRow k="Updated" v={inspector.details.created} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat label="Words" value={inspector.wordCount} />
            <Stat label="Reading" value={inspector.readingTime} />
          </div>

          {inspector.linkedSources.length > 0 && (
            <div>
              <SectionHeader title="Linked Sources" marker />
              {inspector.linkedSources.map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-2 py-1 font-kalam text-[14px] text-ink/80"
                >
                  <FileText className="mt-0.5 size-3.5 shrink-0 text-ink-muted" />
                  <span className="leading-snug">{s}</span>
                </div>
              ))}
            </div>
          )}

          {inspector.generatedAssets.length > 0 && (
            <div>
              <SectionHeader title="Generated Assets" marker />
              <div className="grid grid-cols-2 gap-2">
                {inspector.generatedAssets.map((a) => (
                  <PaperCard key={a.label} shadow="sm" surface="#fffdf9" border={{ strokeWidth: 1, roughness: 0.9 }}>
                    <div className="px-3 py-2.5 text-center">
                      <div className="font-caveat text-[24px] leading-none text-ink">{a.count}</div>
                      <div className="mt-1 font-architect text-[10px] uppercase tracking-wide text-ink-muted">{a.label}</div>
                    </div>
                  </PaperCard>
                ))}
              </div>
            </div>
          )}

          {inspector.relatedTopics.length > 0 && (
            <div>
              <SectionHeader title="Related Topics" marker />
              <div className="flex flex-wrap gap-1.5">
                {inspector.relatedTopics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-ink-muted/20 bg-ink/3 px-2 py-0.5 font-architect text-[11px] text-ink/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <SectionHeader title="Revision Status" marker />
            <PaperStamp label={inspector.revisionStatus} tone="ochre" size="sm" position="none" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center mt-10">
          <Info className="size-8 text-ink-muted/20 mb-3" />
          <p className="font-kalam text-sm text-ink-muted">Select a notebook to view its details.</p>
        </div>
      )}
    </aside>
  );
}
