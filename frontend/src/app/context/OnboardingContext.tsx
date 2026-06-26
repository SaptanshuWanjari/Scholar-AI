import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { api } from "../lib/api";

export type ImportFileStatus = "queued" | "processing" | "completed" | "failed";

export interface ImportFile {
  id: string;
  file: File;
  status: ImportFileStatus;
  error?: string;
}

export interface OnboardingAnalysis {
  documents: number;
  courses: string[];
  topics: string[];
  concepts: string[];
  collections: string[];
  actions: { type: string; label: string }[];
  stats: {
    algorithms: number;
    tables: number;
    diagrams: number;
  };
}

interface OnboardingState {
  files: ImportFile[];
  analysis: OnboardingAnalysis | null;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  startImport: () => Promise<void>;
  setAnalysis: (a: OnboardingAnalysis) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [analysis, setAnalysis] = useState<OnboardingAnalysis | null>(null);
  const importingRef = useRef(false);

  const addFiles = (newFiles: File[]) => {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.file.name));
      const toAdd = newFiles
        .filter((f) => !existingNames.has(f.name))
        .map((f) => ({
          id: `${f.name}-${f.size}`,
          file: f,
          status: "queued" as ImportFileStatus,
        }));
      return [...prev, ...toAdd];
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const startImport = async () => {
    if (importingRef.current) return;
    importingRef.current = true;

    for (const item of files) {
      if (item.status === "completed") continue;

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: "processing" } : f)),
      );

      try {
        const doc = await api.uploadDocument(item.file, "Library");
        if (doc.jobId) {
          const job = await api.pollJobUntilDone(doc.jobId);
          if (job.status === "failed") {
            throw new Error(job.error ?? "Indexing failed");
          }
        }
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "completed" } : f)),
        );
      } catch (err) {
        const error = err instanceof Error ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: "failed", error } : f)),
        );
      }
    }

    importingRef.current = false;
  };

  return (
    <OnboardingContext.Provider
      value={{ files, analysis, addFiles, removeFile, startImport, setAnalysis }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
