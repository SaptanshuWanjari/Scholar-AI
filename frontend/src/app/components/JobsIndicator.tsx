import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { api, JobItem } from "../lib/api";
import { IconButton } from "@paper-ui/components/buttons";
import { PaperBadge } from "@paper-ui/components/badges";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "@paper-ui/components/navigation";
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

const STATUS_TONES: Record<string, "ochre" | "sky" | "sage" | "brick"> = {
  queued: "ochre",
  running: "sky",
  done: "sage",
  failed: "brick",
  success: "sage",
};

const STATUS_ICONS: Record<string, typeof Clock> = {
  queued: Clock,
  running: Loader2,
  done: CheckCircle2,
  failed: XCircle,
  success: CheckCircle2,
};

function StatusChip({ status }: { status: JobItem["status"] }) {
  const Icon = STATUS_ICONS[status];
  return (
    <PaperBadge tone={STATUS_TONES[status]}>
      <Icon size={10} strokeWidth={2} className={status === "running" ? "animate-spin" : undefined} />
      {status}
    </PaperBadge>
  );
}

function NotifChip({ status }: { status: AppNotification["status"] }) {
  const Icon = STATUS_ICONS[status];
  return (
    <PaperBadge tone={STATUS_TONES[status]}>
      <Icon size={10} strokeWidth={2} />
      {status === "success" ? "done" : "failed"}
    </PaperBadge>
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
    <Menubar className="h-auto border-0 bg-transparent p-0 [&>div]:hidden">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <IconButton label="Notifications" className="relative overflow-hidden">
            <Bell className="size-5" />
            {activeCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary font-architect text-[9px] font-bold leading-none text-primary-foreground animate-pulse">
                {activeCount}
              </span>
            )}
          </IconButton>
        </MenubarTrigger>
        <MenubarContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="font-architect text-sm font-semibold">Notifications</p>
              {activeCount > 0 && (
                <p className="font-kalam text-xs text-ink-muted">
                  {activeCount} job{activeCount !== 1 ? "s" : ""} in progress
                </p>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="font-architect text-[11px] text-ink-muted hover:text-ink transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {isEmpty ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center font-architect text-sm text-ink-muted">
              <Bell className="size-6 opacity-40" />
              No notifications
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {merged.map((item) =>
                item._kind === "job" ? (
                  <li key={`job-${item.data.id}`} className="flex items-start gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-architect text-sm leading-tight text-ink">
                        {item.data.label}
                      </p>
                      <p className="mt-0.5 font-kalam text-[11px] text-ink-muted">
                        {elapsedLabel(new Date(item.data.createdAt).getTime())}
                      </p>
                      {item.data.error && (
                        <p className="mt-1 truncate font-kalam text-[11px] text-[#a3544a]">
                          {item.data.error}
                        </p>
                      )}
                    </div>
                    <StatusChip status={item.data.status} />
                  </li>
                ) : (
                  <li key={`notif-${item.data.id}`} className="flex items-start gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-architect text-sm leading-tight text-ink">
                        {item.data.title}
                      </p>
                      <p className="mt-0.5 font-kalam text-[11px] text-ink-muted">
                        {elapsedLabel(item.data.timestamp)}
                      </p>
                      {item.data.message && (
                        <p className="mt-1 truncate font-kalam text-[11px] text-[#a3544a]">
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
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
