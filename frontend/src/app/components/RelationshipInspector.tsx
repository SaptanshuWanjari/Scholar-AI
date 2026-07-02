import React from "react";
import { 
  ArrowRightLeft, 
  FileText, 
  CheckCircle, 
  BarChart, 
  BookOpen,
  X,
  Library,
  GitCompare,
  AlignLeft,
  Network,
  BookmarkPlus
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "@/app/lib/toast";

interface RelationshipInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelationshipInspector({ isOpen, onClose }: RelationshipInspectorProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[420px] flex-col border-l border-neutral-200 bg-white text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex flex-col border-b border-neutral-200 p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Relationship</span>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <h2 className="text-xl font-serif font-medium tracking-tight">Tool Calling</h2>
          <ArrowRightLeft size={18} className="text-neutral-400" />
          <h2 className="text-xl font-serif font-medium tracking-tight">Agent Memory</h2>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700 flex items-center space-x-1">
            <CheckCircle size={12} className="mr-1" />
            87% Confidence
          </Badge>
          <Badge variant="secondary" className="rounded-sm bg-neutral-100 text-neutral-700 font-medium text-xs">
            Type: Uses
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6">
        {/* Relationship Summary */}
        <section className="mb-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500">Summary</h3>
          <p className="text-sm leading-relaxed text-neutral-700 font-serif">
            <span className="font-semibold text-neutral-900">Tool Calling</span> is frequently referenced alongside <span className="font-semibold text-neutral-900">Agent Memory</span> in agent architecture documents. The relationship appears in multiple sources discussing tool-enabled reasoning and memory persistence.
          </p>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Evidence Section */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Found Together In</h3>
          <div className="space-y-3">
            {[
              { name: "Agent Design Patterns.pdf", section: "Architecture", page: 12, conf: "92%" },
              { name: "LangGraph Notes", section: "State Management", page: 4, conf: "88%" },
              { name: "Tool Calling Guide", section: "Memory Interception", page: 1, conf: "85%" },
              { name: "Agent Memory Research", section: "Persistence layer", page: 7, conf: "81%" },
            ].map((source, i) => (
              <Card key={i} className="border border-neutral-200 rounded-md shadow-none hover:bg-neutral-50 transition-colors cursor-pointer">
                <CardContent className="p-3 flex justify-between items-start">
                  <div className="flex space-x-3">
                    <FileText size={16} className="text-neutral-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{source.name}</p>
                      <p className="text-xs text-neutral-500 mt-1 font-serif">Sec: {source.section} • Pg: {source.page}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">{source.conf}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Supporting Chunks */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Supporting Chunks</h3>
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm font-serif leading-relaxed text-neutral-700">
            <p className="mb-2">
              "...when an agent executes <span className="bg-neutral-200 px-1 rounded-sm font-medium">Tool Calling</span> operations, it frequently needs to store the intermediate execution results into <span className="bg-neutral-200 px-1 rounded-sm font-medium">Agent Memory</span> to maintain context over long-running iterative tasks."
            </p>
            <div className="text-xs text-neutral-400 font-sans text-right mt-2">— Agent Design Patterns.pdf, Pg 12</div>
          </div>
        </section>

        <Separator className="mb-8 bg-neutral-100" />

        {/* Graph Statistics */}
        <section className="mb-8">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">Graph Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">14</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Co-occurrences</span>
            </div>
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">4</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Shared Sources</span>
            </div>
            <div className="flex flex-col border border-neutral-200 rounded-md p-3 items-center text-center">
              <span className="text-2xl font-light font-serif text-neutral-900 mb-1">7</span>
              <span className="text-[10px] uppercase tracking-wider text-neutral-500">Shared Artifacts</span>
            </div>
          </div>
        </section>
      </ScrollArea>

      {/* Actions */}
      <div className="border-t border-neutral-200 bg-neutral-50 p-4">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => toast.success("Opening sources")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <Library className="mr-2 h-4 w-4 text-neutral-500" />
            Open Sources
          </Button>
          <Button variant="outline" onClick={() => toast.success("Comparing concepts")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <GitCompare className="mr-2 h-4 w-4 text-neutral-500" />
            Compare Concepts
          </Button>
          <Button variant="outline" onClick={() => toast.success("Generating summary")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <AlignLeft className="mr-2 h-4 w-4 text-neutral-500" />
            Generate Summary
          </Button>
          <Button variant="outline" onClick={() => toast.success("Creating diagram")} className="w-full text-xs font-medium justify-start border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100">
            <Network className="mr-2 h-4 w-4 text-neutral-500" />
            Create Diagram
          </Button>
          <Button variant="default" onClick={() => toast.success("Added to Notebook")} className="w-full col-span-2 text-xs font-medium mt-1 bg-neutral-900 text-white hover:bg-neutral-800">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Add To Notebook
          </Button>
        </div>
      </div>
    </div>
  );
}
