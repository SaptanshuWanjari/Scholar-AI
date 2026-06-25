import { useEffect, useState } from "react";
import { Code2, Search, Filter } from "lucide-react";
import { Page } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { api } from "../lib/api";
import type { CodeExample } from "../lib/types";
import { CodeExampleCard } from "../components/CodeExampleCard";
import { CodeExampleViewer } from "../components/CodeExampleViewer";

export function CodeLibrary() {
  const [examples, setExamples] = useState<CodeExample[]>([]);
  const [search, setSearch] = useState("");
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null);
  
  // Basic filtering states
  const [courseFilter, setCourseFilter] = useState<string>("");
  const [langFilter, setLangFilter] = useState<string>("");

  const loadExamples = async () => {
    try {
      // Searching client side for now with a generous limit, 
      // or we can pass filters to API if needed.
      const res = await api.listCodeExamples({ limit: 100 });
      setExamples(res.items);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadExamples();
  }, []);

  const filtered = examples.filter(ex => {
    if (search && !ex.title.toLowerCase().includes(search.toLowerCase()) && !ex.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (courseFilter && ex.course !== courseFilter) return false;
    if (langFilter && ex.language !== langFilter) return false;
    return true;
  });

  // Extract unique filter options
  const courses = Array.from(new Set(examples.map(e => e.course).filter(Boolean)));
  const languages = Array.from(new Set(examples.map(e => e.language).filter(Boolean)));

  return (
    <Page className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Code Library</h1>
          <p className="text-muted-foreground mt-1 text-sm">Review extracted programming examples, algorithms, and configurations.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search code examples..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="pl-9 bg-card border-border"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="size-4 text-muted-foreground ml-2" />
          <select 
            className="h-9 rounded-md border border-input bg-card px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="h-9 rounded-md border border-input bg-card px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(ex => (
            <CodeExampleCard key={ex.id} example={ex} onClick={setSelectedExample} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-accent mb-4">
            <Code2 className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No code examples found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">Upload computer science materials and enable code extraction to populate this library.</p>
        </div>
      )}

      {selectedExample && (
        <CodeExampleViewer 
          example={selectedExample} 
          onClose={() => setSelectedExample(null)} 
        />
      )}
    </Page>
  );
}
