import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { Course } from "../../lib/types";
import { api, type NotebookMeta } from "../../lib/api";
import { useState } from "react";

export function CreateNotebookDialog({
  open,
  onOpenChange,
  courses,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onCreated: (meta: NotebookMeta) => void;
}) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState<string>("none");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) {
      toast.error("Enter a notebook title");
      return;
    }
    setCreating(true);
    try {
      const nb = await api.createNotebook(
        trimmed,
        course === "none" ? null : course,
      );
      const meta: NotebookMeta = {
        id: nb.id,
        name: nb.title,
        course: nb.course,
        color: nb.color,
        notes: nb.blocks?.length ?? 0,
        lastEdited: "just now",
      };
      onCreated(meta);
      onOpenChange(false);
      setTitle("");
      setCourse("none");
      toast.success(`Created "${nb.title}"`);
    } catch (e: any) {
      toast.error(`Failed to create notebook: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New notebook</DialogTitle>
          <DialogDescription>
            Give your notebook a title and optionally link a course.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Title
            </label>
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !creating) handleCreate();
              }}
              placeholder="e.g. Machine Learning"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Course (optional)
            </label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="No course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No course</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating || !title.trim()}
          >
            {creating && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
