import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { api, JobItem } from "../lib/api";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

const POLL_INTERVAL_MS = 4000;
const MAX_DISPLAYED = 8;

function elapsedLabel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

function StatusChip({ status }: { status: JobItem["status"] }) {
  if (status === "queued") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        <Clock className="size-3" />
        queued
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
        <Loader2 className="size-3 animate-spin" />
        running
      </span>
    );
  }
  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3" />
        done
      </span>
    );
  }
  // failed
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
      <XCircle className="size-3" />
      failed
    </span>
  );
}

export function JobsIndicator() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasActive = jobs.some(
    (j) => j.status === "queued" || j.status === "running"
  );

  const fetchJobs = async () => {
    try {
      const data = await api.listJobs();
      // Sort by most-recent first, keep last MAX_DISPLAYED
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setJobs(sorted.slice(0, MAX_DISPLAYED));
    } catch {
      // silently ignore; don't break the UI on transient errors
    }
  };

  useEffect(() => {
    fetchJobs();
    timerRef.current = setInterval(fetchJobs, POLL_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Stop polling when all jobs are settled; resume only on re-mount
  useEffect(() => {
    if (!hasActive && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    } else if (hasActive && !timerRef.current) {
      timerRef.current = setInterval(fetchJobs, POLL_INTERVAL_MS);
    }
  }, [hasActive]);

  const activeCount = jobs.filter(
    (j) => j.status === "queued" || j.status === "running"
  ).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative shrink-0">
          <Bell className="size-[18px]" />
          {activeCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold leading-none text-primary-foreground animate-pulse">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Background Jobs</p>
          {activeCount > 0 && (
            <p className="text-xs text-muted-foreground">
              {activeCount} job{activeCount !== 1 ? "s" : ""} in progress
            </p>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
            <Bell className="size-6 opacity-40" />
            No background jobs
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {jobs.map((job) => (
              <li key={job.id} className="flex items-start gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">
                    {job.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {elapsedLabel(job.createdAt)}
                  </p>
                  {job.error && (
                    <p className="mt-1 truncate text-[11px] text-destructive">
                      {job.error}
                    </p>
                  )}
                </div>
                <StatusChip status={job.status} />
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
