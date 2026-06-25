import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
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

  // Fetch real data whenever the menu opens.
  useEffect(() => {
    if (!open) return;
    api.listCourses().then(setCourses).catch(() => setCourses([]));
    api.listDocuments().then(setDocuments).catch(() => setDocuments([]));
  }, [open]);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, documents, courses…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem key={item.to} onSelect={() => go(item.to)}>
              <item.icon className="size-4 text-muted-foreground" />
              <span>{item.label}</span>
              {item.shortcut && (
                <kbd className="ml-auto rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
                  {item.shortcut}
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Documents">
          {documents.slice(0, 4).map((d) => (
            <CommandItem key={d.id} onSelect={() => go("/documents")}>
              <FileText className="size-4 text-muted-foreground" />
              <span className="truncate">{d.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Courses">
          {courses.map((c) => (
            <CommandItem key={c.id} onSelect={() => go("/knowledge")}>
              <GraduationCap className="size-4" style={{ color: c.color }} />
              <span>{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{c.code}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

