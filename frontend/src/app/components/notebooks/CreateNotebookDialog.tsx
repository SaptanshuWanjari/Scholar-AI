import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PaperModal } from "@/paper-ui/components/dialogs";
import { PaperInput, PaperSelect } from "@/paper-ui/components/inputs";
import { PaperButton } from "@/paper-ui/components/buttons";
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
    <PaperModal
      open={open}
      onClose={() => onOpenChange(false)}
      title="New notebook"
      footer={
        <>
          <PaperButton
            tone="paper"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </PaperButton>
          <PaperButton
            tone="dark"
            size="sm"
            onClick={handleCreate}
            disabled={creating || !title.trim()}
          >
            {creating && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create
          </PaperButton>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Give your notebook a title and optionally link a course.
        </p>
        <PaperInput
          label="Title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !creating) handleCreate();
          }}
          placeholder="e.g. Machine Learning"
        />
        <PaperSelect
          label="Course (optional)"
          value={course}
          onChange={setCourse}
          options={[
            { value: "none", label: "No course" },
            ...courses.map((c) => ({ value: c.name, label: c.name })),
          ]}
          placeholder="No course"
        />
      </div>
    </PaperModal>
  );
}
