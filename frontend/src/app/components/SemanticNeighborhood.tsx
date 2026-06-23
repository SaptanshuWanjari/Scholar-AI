import React, { useState } from "react";
import { 
  Network, 
  BookOpen, 
  FileText, 
  GitCompare, 
  BookmarkPlus, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import * as HoverCard from "@radix-ui/react-hover-card";
import { toast } from "sonner";

interface Concept {
  id: string;
  name: string;
  similarity: number;
  definition: string;
  refCount: number;
  sourceCount: number;
}

const concepts: Concept[] = [
  {
    id: "c1",
    name: "Function Calling",
    similarity: 0.93,
    definition: "The ability of a language model to execute predefined functions based on user intent.",
    refCount: 24,
    sourceCount: 8
  },
  {
    id: "c2",
    name: "Agent Tools",
    similarity: 0.91,
    definition: "External utilities and APIs provided to an autonomous agent to interact with its environment.",
    refCount: 31,
    sourceCount: 12
  },
  {
    id: "c3",
    name: "MCP",
    similarity: 0.88,
    definition: "Model Context Protocol; a standardized interface for providing context and tools to language models.",
    refCount: 18,
    sourceCount: 5
  },
  {
    id: "c4",
    name: "LangGraph Tools",
    similarity: 0.86,
    definition: "Stateful, graph-based execution nodes representing tools in the LangChain ecosystem.",
    refCount: 15,
    sourceCount: 6
  },
  {
    id: "c5",
    name: "Tool Execution",
    similarity: 0.82,
    definition: "The process by which an AI agent runs an invoked tool and parses the resulting output.",
    refCount: 42,
    sourceCount: 14
  }
];

export function SemanticNeighborhood({ isOpen = true, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="flex w-[420px] flex-col border border-neutral-200/80 bg-white text-neutral-900 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-5 py-4">
        <div className="flex items-center gap-2.5 text-neutral-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <h2 className="text-base font-semibold tracking-tight">Nearest Concepts</h2>
        </div>
      </div>
      
      {/* Target Concept */}
      <div className="px-6 py-6 bg-gradient-to-b from-neutral-50/50 to-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Selected Concept</div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-extrabold tracking-tight text-neutral-900">Tool Calling</h3>
            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 shadow-sm">
              Core Node
            </Badge>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            The mechanism enabling language models to interface with external systems by predicting structured arguments for predefined functions.
          </p>
        </div>
      </div>

      {/* Neighborhood List */}
      <div className="flex-1 bg-neutral-50/40 border-t border-neutral-100">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Semantic Neighborhood</div>
            <div className="text-[11px] font-medium text-neutral-400">Cosine Sim</div>
          </div>

          <div className="space-y-2.5">
            {concepts.map((concept, idx) => (
              <HoverCard.Root key={concept.id} openDelay={150}>
                <HoverCard.Trigger asChild>
                  <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-neutral-200/60 bg-white p-3 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5">
                    {/* Similarity Bar Background */}
                    <div 
                      className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-indigo-50/80 to-purple-50/40 transition-all duration-500 ease-out group-hover:from-indigo-100/80 group-hover:to-purple-100/40"
                      style={{ width: `${Math.max(15, (concept.similarity - 0.7) * 333)}%` }} 
                    />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 border border-neutral-100 shadow-sm text-[11px] font-bold text-neutral-500 group-hover:text-indigo-600 transition-colors backdrop-blur-sm">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-neutral-700 group-hover:text-indigo-700 transition-colors">
                          {concept.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-mono font-semibold text-indigo-600/90">
                          {concept.similarity.toFixed(2)}
                        </span>
                        <ChevronRight className="h-4 w-4 text-neutral-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </HoverCard.Trigger>
                
                <HoverCard.Portal>
                  <HoverCard.Content 
                    className="z-50 w-80 rounded-xl border border-neutral-200/80 bg-white/95 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ring-1 ring-black/5"
                    sideOffset={10}
                    side="right"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                            <Sparkles className="h-3.5 w-3.5" />
                          </div>
                          <h4 className="font-bold text-neutral-900">{concept.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono bg-white">{concept.similarity} Sim</Badge>
                      </div>
                      
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {concept.definition}
                      </p>
                      
                      <div className="flex gap-4 pt-3 border-t border-neutral-100/80 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <FileText className="h-3.5 w-3.5 text-blue-500" />
                          <span className="font-semibold text-neutral-700">{concept.refCount}</span> References
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-semibold text-neutral-700">{concept.sourceCount}</span> Sources
                        </div>
                      </div>
                    </div>
                  </HoverCard.Content>
                </HoverCard.Portal>
              </HoverCard.Root>
            ))}
          </div>
        </div>
      </div>

      <Separator className="bg-neutral-100" />

      {/* Action Footer */}
      <div className="bg-white p-5">
        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="outline" onClick={() => toast.success("Concept opened")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            Open Concept
          </Button>
          <Button variant="outline" onClick={() => toast.success("Comparing concepts")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <GitCompare className="h-3.5 w-3.5 text-neutral-500" />
            Compare
          </Button>
          <Button variant="outline" onClick={() => toast.success("Expanded")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm hover:bg-neutral-50 transition-colors border-neutral-200">
            <Maximize2 className="h-3.5 w-3.5 text-neutral-500" />
            Expand
          </Button>
          <Button onClick={() => toast.success("Added to Notebook")} className="w-full justify-start gap-2 h-9 text-[13px] font-medium shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
            <BookmarkPlus className="h-3.5 w-3.5 text-indigo-200" />
            Add to Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}
