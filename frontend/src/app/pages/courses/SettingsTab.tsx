import { useState } from "react";
import { toast } from "@/app/lib/toast";
import { Save } from "lucide-react";
import { api } from "../../lib/api";
import type { Course } from "../../lib/types";
import { PaperTextarea } from "@/paper-ui/components/inputs";
import { PaperButton } from "@/paper-ui/components/buttons";

interface SettingsTabProps {
  course: Course;
  onUpdate: () => void;
}

export function SettingsTab({ course, onUpdate }: SettingsTabProps) {
  const [systemPrompt, setSystemPrompt] = useState(course.systemPrompt ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateCourse(course.id, course.name, systemPrompt);
      toast.success("Settings saved successfully");
      onUpdate();
    } catch (err) {
      toast.error(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-3">
        <div>
          <label className="font-caveat text-[24px] font-bold text-ink mb-1 block">Custom System Prompt</label>
          <p className="font-kalam text-[15px] text-ink-muted mb-3">
            Instruct the AI on how to act when answering questions for this course.
          </p>
          <PaperTextarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="min-h-[128px]"
            placeholder="e.g., You are an expert in Data Structures and Algorithms..."
          />
        </div>
        <PaperButton tone="dark" onClick={handleSave} disabled={isSaving}>
          <Save className="size-5" />
          {isSaving ? "Saving..." : "Save Settings"}
        </PaperButton>
      </div>
    </div>
  );
}
