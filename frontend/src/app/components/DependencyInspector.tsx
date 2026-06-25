import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Clock, Loader2, Star } from "lucide-react";
import { api, type DepConceptInspector, type DepLink } from "../lib/api";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

/** Mastery status → badge colour. Mirrors the engine's status enum. */
const MASTERY_STYLES: Record<string, string> = {
  Mastered: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  Learning: "border-sky-500/40 bg-sky-500/10 text-sky-500",
  Weak: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  "Needs Revision": "border-orange-500/40 bg-orange-500/10 text-orange-500",
  Unknown: "border-border bg-card text-muted-foreground",
};

function MasteryBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-[10px]", MASTERY_STYLES[status] ?? MASTERY_STYLES.Unknown)}>
      {status}
    </Badge>
  );
}

function LinkRow({ link }: { link: DepLink }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-2.5 py-1.5">
      <span className="text-sm text-foreground/80">{link.name}</span>
      <MasteryBadge status={link.masteryStatus} />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

/**
 * Dependency Inspector — prerequisite/dependent graph + mastery for a concept.
 * Resolves by concept *name* because the knowledge-graph ids the rest of the
 * page uses differ from the dependency engine's ids. Renders nothing when the
 * dependency graph hasn't been built for this concept (404).
 */
export function DependencyInspector({ conceptName, course }: { conceptName: string; course?: string | null }) {
  const [data, setData] = useState<DepConceptInspector | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    setState("loading");
    api
      .resolveConceptDependencies(conceptName, course ?? null)
      .then((d) => alive && (setData(d), setState("ready")))
      .catch(() => alive && setState("missing"));
    return () => {
      alive = false;
    };
  }, [conceptName, course]);

  if (state === "loading") {
    return (
      <Block title="Dependencies">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin text-violet" /> Loading prerequisites…
        </div>
      </Block>
    );
  }

  if (state === "missing" || !data) {
    return (
      <Block title="Dependencies">
        <p className="text-xs text-muted-foreground">
          No prerequisite data yet. Build the dependency graph to map learning order.
        </p>
      </Block>
    );
  }

  return (
    <>
      <Block title="Dependencies">
        <div className="flex flex-wrap items-center gap-2">
          <MasteryBadge status={data.masteryStatus} />
          <Badge variant="outline" className="text-[10px]">{data.difficulty}</Badge>
          <Badge variant="outline" className="gap-1 text-[10px]">
            <Star className="size-3" /> {(data.importance * 100).toFixed(0)}%
          </Badge>
          {data.estStudyTimeMin > 0 && (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Clock className="size-3" /> {data.estStudyTimeMin}m
            </Badge>
          )}
          {data.pyqFrequency > 0 && (
            <Badge variant="outline" className="text-[10px]">PYQ ×{data.pyqFrequency}</Badge>
          )}
        </div>
      </Block>

      <Block title="Prerequisites">
        {data.prerequisites.length ? (
          <div className="space-y-1.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowUp className="size-3" /> Understand these first
            </div>
            {data.prerequisites.map((p) => (
              <LinkRow key={p.id} link={p} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Foundational — no prerequisites.</p>
        )}
      </Block>

      <Block title="Unlocks">
        {data.dependents.length ? (
          <div className="space-y-1.5">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ArrowDown className="size-3" /> Enables these next
            </div>
            {data.dependents.map((d) => (
              <LinkRow key={d.id} link={d} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Nothing depends on this yet.</p>
        )}
      </Block>
    </>
  );
}
