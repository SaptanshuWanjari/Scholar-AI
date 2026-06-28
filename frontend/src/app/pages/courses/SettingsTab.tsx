import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import type { Course } from "../../lib/types";

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
          <label className="text-[20px] font-medium mb-1 block">
            Custom System Prompt
          </label>
          <p className="text-[15px] text-muted-foreground mb-3">
            Instruct the AI on how to act when answering questions for this
            course.{" "}
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-32 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
            placeholder="e.g., You are an expert in Data Structures and Algorithms..."
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="text-md">
          <Save className="size-5 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
