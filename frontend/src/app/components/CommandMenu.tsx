import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { CommandBar } from "@paper-ui/components/navigation";
import type { CommandEntry } from "@paper-ui/components/navigation";
import { navItems } from "../lib/nav";
import { useUIStore } from "../stores/useUIStore";
import { api } from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";
import { FileText, GraduationCap } from "lucide-react";

export function CommandMenu() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
  }, [open]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  const commands: CommandEntry[] = [
    ...navItems.map((item) => ({
      key: `nav-${item.to}`,
      label: item.label,
      icon: <item.icon className="size-4" />,
      shortcut: item.shortcut ? [item.shortcut.toUpperCase()] : undefined,
      action: () => go(item.to),
    })),
    ...documents.slice(0, 4).map((d) => ({
      key: `doc-${d.id}`,
      label: d.title,
      icon: <FileText className="size-4" />,
      action: () => go("/documents"),
    })),
    ...courses.map((c) => ({
      key: `course-${c.id}`,
      label: c.name,
      description: c.code,
      icon: <GraduationCap className="size-4" />,
      action: () => go("/knowledge"),
    })),
  ];

  return (
    <CommandBar
      open={open}
      onClose={() => setOpen(false)}
      commands={commands}
      placeholder="Search pages, documents, courses…"
    />
  );
}
