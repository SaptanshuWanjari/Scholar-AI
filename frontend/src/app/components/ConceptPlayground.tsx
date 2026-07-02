import React, { useState } from "react";
import { 
  X, BookOpen, FileText, Network, CheckCircle, Save, 
  BrainCircuit, ListChecks, Sparkles, CornerDownRight, 
  Library, GitCompare, MessageSquareText, Search, Link2, Send
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "./ui/select";
import { toast } from "@/app/lib/toast";

interface ConceptPlaygroundProps {
  isOpen: boolean;
  onClose: () => void;
  conceptName?: string;
}

export function ConceptPlayground({ isOpen, onClose, conceptName = "Tool Calling" }: ConceptPlaygroundProps) {
  const [scope, setScope] = useState("only_this");
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-[600px] flex-col border-l border-neutral-200 bg-neutral-50/50 text-neutral-900 shadow-2xl transition-transform duration-300 ease-in-out">
      
      {/* Header */}
      <div className="flex flex-col border-b border-neutral-200 bg-white p-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Ask About This Concept</span>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        <h2 className="text-2xl font-serif font-medium tracking-tight mb-4 flex items-center space-x-2">
          <BrainCircuit className="text-neutral-700 mr-2" size={24} />
          {conceptName}
        </h2>

        <div className="flex items-center space-x-3 mb-4">
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700">
            <Link2 size={12} className="mr-1 inline-block" />
            4 Connected Sources
          </Badge>
          <Badge variant="outline" className="rounded-sm border-neutral-300 font-mono text-xs font-normal text-neutral-700">
            <Network size={12} className="mr-1 inline-block" />
            12 Related Concepts
          </Badge>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center space-x-2 bg-neutral-50 p-2 rounded-md border border-neutral-200">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider ml-2">Context Scope:</span>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[200px] h-8 text-xs bg-white border-neutral-200 focus:ring-0 focus:ring-offset-0 shadow-none">
              <SelectValue placeholder="Select Scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="only_this" className="text-xs">Only This Concept</SelectItem>
              <SelectItem value="connected_concepts" className="text-xs">Connected Concepts</SelectItem>
              <SelectItem value="connected_sources" className="text-xs">Connected Sources</SelectItem>
              <SelectItem value="entire_kb" className="text-xs">Entire Knowledge Base</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 py-6 bg-white">
        
        {/* Research Note View (Editorial Reading Style) */}
        <div className="space-y-8 pb-10">
          
          <div className="prose prose-neutral prose-sm max-w-none">
            <h3 className="text-xl font-serif font-medium border-b border-neutral-100 pb-2 flex items-center">
              <MessageSquareText size={18} className="mr-2 text-neutral-400" />
              How does Tool Calling differ from MCP?
            </h3>
            
            <p className="leading-relaxed text-neutral-700 font-serif mt-4">
              <strong className="text-neutral-900 font-semibold">Tool Calling</strong> is the mechanism by which an LLM emits a structured JSON object representing a function invocation, whereas the <strong className="text-neutral-900 font-semibold">Model Context Protocol (MCP)</strong> is a broader standardization for how tools, prompts, and resources are discovered and exposed to models.
            </p>
            
            <p className="leading-relaxed text-neutral-700 font-serif mt-3">
              While Tool Calling focuses entirely on the output format (e.g., matching a JSON schema to a Python function), MCP defines a client-server architecture. An MCP Server can expose multiple tools that the model can then call using standard Tool Calling.
            </p>
          </div>

          {/* Source Grounding */}
          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Source Grounding</span>
              <Badge variant="outline" className="rounded-sm border-emerald-200 bg-emerald-50 text-emerald-700 font-mono text-[10px] uppercase font-semibold">
                <CheckCircle size={10} className="mr-1 inline-block" />
                94% Confidence
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-neutral-700">
                <FileText size={14} className="text-neutral-400" />
                <span className="font-medium">MCP Specification.md</span>
                <span className="text-xs text-neutral-400 font-serif">— Architecture Section</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-700">
                <FileText size={14} className="text-neutral-400" />
                <span className="font-medium">Agent Design Patterns.pdf</span>
                <span className="text-xs text-neutral-400 font-serif">— Pg 14</span>
              </div>
            </div>

            <div className="border-l-2 border-neutral-300 pl-3 py-1 text-sm font-serif leading-relaxed text-neutral-600 bg-white rounded-r-md">
              <CornerDownRight size={12} className="inline mr-2 text-neutral-400 -mt-1" />
              "The Model Context Protocol standardizes the transport layer, allowing tools to be served over stdio or SSE. The underlying model still relies on native Tool Calling features to execute these endpoints."
            </div>
          </div>
          
        </div>

        <Separator className="my-6 bg-neutral-100" />

        {/* Suggested Questions */}
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500 flex items-center">
            <Sparkles size={14} className="mr-2 text-neutral-400" />
            Continue Exploring
          </h3>
          <div className="flex flex-col space-y-2">
            {[
              "What are the prerequisites?",
              "Show real-world examples.",
              "Compare with Agent Memory.",
              "How is this implemented in LangGraph?"
            ].map((q, i) => (
              <button key={i} onClick={() => toast.success(`Asking: ${q}`)} className="text-left text-sm font-serif text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-md transition-colors flex items-center group border border-transparent hover:border-neutral-200">
                <Search size={14} className="mr-3 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                {q}
              </button>
            ))}
          </div>
        </div>

      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-neutral-200 p-4 pb-0">
        <div className="relative">
          <textarea 
            className="w-full min-h-[80px] rounded-md border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm font-serif placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white transition-colors resize-none"
            placeholder="Ask about Tool Calling..."
          />
          <Button size="icon" onClick={() => toast.success("Question submitted")} className="absolute bottom-3 right-3 h-8 w-8 rounded-sm bg-neutral-900 text-white hover:bg-neutral-800">
            <Send size={14} />
          </Button>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Saved to Notebook")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Save className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Save to Notebook
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Flashcards generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Library className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Flashcards
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Quiz generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <ListChecks className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Quiz
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Diagram generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <Network className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Diagram
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Mind Map generated")} className="flex-1 text-xs font-medium border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50 h-8">
            <GitCompare className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Generate Mind Map
          </Button>
        </div>
      </div>

    </div>
  );
}
