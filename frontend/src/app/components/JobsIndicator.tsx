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
import { useNotificationStore, type AppNotification } from "../stores/useNotificationStore";

const POLL_INTERVAL_MS = 4000;
const MAX_DISPLAYED = 12;

function elapsedLabel(ms: number): string {
  const diff = Date.now() - ms;
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
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
      <XCircle className="size-3" />
      failed
    </span>
  );
}

function NotifChip({ status }: { status: AppNotification["status"] }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3" />
        done
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
      <XCircle className="size-3" />
      failed
    </span>
  );
}

type DisplayItem =
  | { _kind: "job"; data: JobItem }
  | { _kind: "notif"; data: AppNotification };

export function JobsIndicator() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifications = useNotificationStore((s) => s.notifications);
  const clearAll = useNotificationStore((s) => s.clearAll);

  const hasActive = jobs.some(
    (j) => j.status === "queued" || j.status === "running"
  );

  const fetchJobs = async () => {
    try {
      const data = await api.listJobs();
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

  const merged: DisplayItem[] = [
    ...jobs.map((j): DisplayItem => ({ _kind: "job", data: j })),
    ...notifications.map((n): DisplayItem => ({ _kind: "notif", data: n })),
  ]
    .sort((a, b) => {
      const ta =
        a._kind === "job"
          ? new Date(a.data.createdAt).getTime()
          : a.data.timestamp;
      const tb =
        b._kind === "job"
          ? new Date(b.data.createdAt).getTime()
          : b.data.timestamp;
      return tb - ta;
    })
    .slice(0, MAX_DISPLAYED);

  const isEmpty = merged.length === 0;

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
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            {activeCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {activeCount} job{activeCount !== 1 ? "s" : ""} in progress
              </p>
            )}
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
            <Bell className="size-6 opacity-40" />
            No notifications
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {merged.map((item) =>
              item._kind === "job" ? (
                <li key={`job-${item.data.id}`} className="flex items-start gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {item.data.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {elapsedLabel(new Date(item.data.createdAt).getTime())}
                    </p>
                    {item.data.error && (
                      <p className="mt-1 truncate text-[11px] text-destructive">
                        {item.data.error}
                      </p>
                    )}
                  </div>
                  <StatusChip status={item.data.status} />
                </li>
              ) : (
                <li key={`notif-${item.data.id}`} className="flex items-start gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {item.data.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {elapsedLabel(item.data.timestamp)}
                    </p>
                    {item.data.message && (
                      <p className="mt-1 truncate text-[11px] text-destructive">
                        {item.data.message}
                      </p>
                    )}
                  </div>
                  <NotifChip status={item.data.status} />
                </li>
              )
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
