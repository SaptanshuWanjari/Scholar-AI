import { useState } from "react";
import { Maximize2, Plus, Network, PanelRightOpen } from "lucide-react";
import { MindMapViewer } from "../components/MindMapViewer";
import { RelationshipInspector } from "../components/RelationshipInspector";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { courses } from "../lib/mock-data";
import { toast } from "sonner";

export function MindMaps() {
  const [inspectorOpen, setInspectorOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="size-4 text-primary" />
            <span className="text-sm font-medium">Neural Networks — Knowledge Tree</span>
          </div>
          <Badge variant="outline" className="border-cyan/40 bg-cyan-soft text-cyan">
            11 nodes
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={courses[0].name}>
            <SelectTrigger className="w-48 bg-input-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => toast.success("Node added")} className="gap-1.5">
            <Plus className="size-3.5" /> Node
          </Button>
          <Button variant="outline" size="icon" className="size-9" onClick={() => setInspectorOpen(true)}>
            <PanelRightOpen className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => toast.success("Expanded")} className="size-9">
            <Maximize2 className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <MindMapViewer />
        <RelationshipInspector 
          isOpen={inspectorOpen} 
          onClose={() => setInspectorOpen(false)} 
        />
      </div>
    </div>
  );
}
