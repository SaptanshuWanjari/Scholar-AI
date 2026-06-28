import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Loader2,
  History,
  Save,
  Sparkles,
  Download,
  RotateCcw,
  X,
  Check,
  Dot,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { ExcalidrawCanvas } from "../components/whiteboard/ExcalidrawCanvas";
import { AddToNotebookMenu } from "../components/AddToNotebookMenu";
import { api } from "../lib/api";
import type { WhiteboardFull, WhiteboardRevision, WhiteboardScene } from "../lib/types";
import { mermaidToScene, mergeMermaidIntoScene, sceneThumbnail } from "../lib/whiteboard";
import { useWhiteboardPrefs } from "../plugins/excalidraw/useWhiteboardPrefs";
import { cn } from "../components/ui/utils";

// "each-edit" debounce — short, just enough to batch a flurry of strokes.
const EACH_EDIT_MS = 500;
// "timed" mode flushes pending changes on this interval.
const TIMED_INTERVAL_MS = 8000;

export function WhiteboardEditor() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const autosaveMode = useWhiteboardPrefs((s) => s.autosaveMode);

  const [wb, setWb] = useState<WhiteboardFull | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false); // unsaved live-scene changes
  const [busy, setBusy] = useState<string | null>(null); // AI action in flight

  const [historyOpen, setHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<WhiteboardRevision[]>([]);
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainText, setExplainText] = useState("");
  const [genOpen, setGenOpen] = useState(false);
  const [genTopic, setGenTopic] = useState("");

  const apiRef = useRef<any>(null);
  const sceneRef = useRef<WhiteboardScene>({});
  const dirtyRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Latest persist fn, so timer/interval/unmount always call the current one.
  const persistRef = useRef<((scene: WhiteboardScene) => Promise<void>) | null>(null);
  const modeRef = useRef(autosaveMode);
  modeRef.current = autosaveMode;
  // Bumped to force-remount the canvas with a new initial scene (restore/generate).
  const [canvasKey, setCanvasKey] = useState(0);

  // ── load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getWhiteboard(id)
      .then((data) => {
        if (cancelled) return;
        setWb(data);
        setTitle(data.title);
        sceneRef.current = data.scene ?? {};
      })
      .catch(() => {
        if (!cancelled) toast.error("Whiteboard not found");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Auto-generate from a topic passed via ?generate= (reading-mode selection).
  useEffect(() => {
    const topic = searchParams.get("generate");
    if (topic && wb && !loading) {
      setGenTopic(topic);
      void runGenerate(topic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wb, loading]);

  // ── persistence ───────────────────────────────────────────────────────────
  const persist = useCallback(
    async (scene: WhiteboardScene) => {
      setSaving(true);
      try {
        const thumbnail = await sceneThumbnail(scene);
        await api.updateWhiteboard(id, { scene, thumbnail });
        dirtyRef.current = false;
        setDirty(false);
      } catch {
        /* transient autosave failure — next change retries */
      } finally {
        setSaving(false);
      }
    },
    [id],
  );
  persistRef.current = persist;

  // Flush any pending changes immediately (used by timed interval, manual save,
  // and unmount). No-op when nothing is dirty.
  const flush = useCallback(() => {
    if (!dirtyRef.current) return;
    void persistRef.current?.(sceneRef.current);
  }, []);

  // Canvas onChange — behaviour depends on the chosen autosave mode.
  const handleChange = useCallback(
    (scene: WhiteboardScene) => {
      sceneRef.current = scene;
      dirtyRef.current = true;
      setDirty(true);
      if (modeRef.current === "each-edit") {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => void persistRef.current?.(scene), EACH_EDIT_MS);
      }
      // "timed" is handled by the interval below; "manual" waits for an explicit save.
    },
    [],
  );

  // Time-based autosave: periodically flush while there are pending changes.
  useEffect(() => {
    if (autosaveMode !== "timed") return;
    const t = setInterval(flush, TIMED_INTERVAL_MS);
    return () => clearInterval(t);
  }, [autosaveMode, flush]);

  // Flush on unmount so navigating away never loses work, regardless of mode.
  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (dirtyRef.current) void persistRef.current?.(sceneRef.current);
    },
    [],
  );

  const saveTitle = async () => {
    if (!wb || title.trim() === wb.title) return;
    try {
      const updated = await api.updateWhiteboard(id, { title: title.trim() || "Untitled whiteboard" });
      setWb(updated);
      setTitle(updated.title);
    } catch {
      toast.error("Failed to rename");
    }
  };

  // ── revisions ─────────────────────────────────────────────────────────────
  const openHistory = async () => {
    setHistoryOpen(true);
    try {
      setRevisions(await api.listWhiteboardRevisions(id));
    } catch {
      toast.error("Failed to load history");
    }
  };

  const saveRevision = async () => {
    try {
      const rev = await api.saveWhiteboardRevision(id, sceneRef.current, "");
      toast.success(`Saved revision ${rev.revisionNumber}`);
      if (historyOpen) setRevisions(await api.listWhiteboardRevisions(id));
    } catch {
      toast.error("Failed to save revision");
    }
  };

  const restore = async (revisionNumber: number) => {
    try {
      const updated = await api.restoreWhiteboardRevision(id, revisionNumber);
      sceneRef.current = updated.scene ?? {};
      setWb(updated);
      setCanvasKey((k) => k + 1); // remount canvas with restored scene
      toast.success(`Restored revision ${revisionNumber}`);
      setHistoryOpen(false);
    } catch {
      toast.error("Failed to restore");
    }
  };

  // ── AI assist ─────────────────────────────────────────────────────────────
  const applyScene = (scene: WhiteboardScene) => {
    sceneRef.current = scene;
    if (apiRef.current) {
      apiRef.current.updateScene({ elements: scene.elements ?? [] });
      if (scene.files) apiRef.current.addFiles(Object.values(scene.files));
      apiRef.current.scrollToContent?.(scene.elements ?? [], { fitToContent: true });
    } else {
      setCanvasKey((k) => k + 1);
    }
    void persist(scene);
  };

  const runGenerate = async (topic: string) => {
    const t = topic.trim();
    if (!t) return;
    setBusy("generate");
    setGenOpen(false);
    try {
      const res = await api.generateWhiteboard({ topic: t, course: wb?.course || null });
      if (!res.mermaid?.trim()) {
        toast.error("Could not generate a diagram for this topic");
        return;
      }
      const scene = await mermaidToScene(res.mermaid);
      applyScene(scene);
      toast.success("Diagram generated — edit freely");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setBusy(null);
    }
  };

  const sceneLabels = (): string => {
    const els = (apiRef.current?.getSceneElements?.() ?? sceneRef.current.elements ?? []) as any[];
    return els
      .filter((e) => e.type === "text" && e.text)
      .map((e) => e.text.trim())
      .filter(Boolean)
      .join("\n");
  };

  const runExplain = async () => {
    const labels = sceneLabels();
    if (!labels) {
      toast.error("Add some labels to the whiteboard first");
      return;
    }
    setBusy("explain");
    try {
      const res = await api.assistWhiteboard("explain", labels, wb?.course || null);
      setExplainText(res.text || "No explanation returned.");
      setExplainOpen(true);
    } catch {
      toast.error("Explain failed");
    } finally {
      setBusy(null);
    }
  };

  const runExpand = async () => {
    const selected = apiRef.current?.getAppState?.()?.selectedElementIds ?? {};
    const els = (apiRef.current?.getSceneElements?.() ?? []) as any[];
    const node = els.find((e) => selected[e.id] && e.type === "text" && e.text);
    const label = node?.text?.trim();
    if (!label) {
      toast.error("Select a text node to expand");
      return;
    }
    setBusy("expand");
    try {
      const res = await api.assistWhiteboard("expand", label, wb?.course || null);
      if (!res.mermaid?.trim()) {
        toast.error("Nothing to add");
        return;
      }
      const merged = await mergeMermaidIntoScene(
        { elements: els, files: sceneRef.current.files ?? {} },
        res.mermaid,
      );
      applyScene(merged);
      toast.success(`Expanded "${label}"`);
    } catch {
      toast.error("Expand failed");
    } finally {
      setBusy(null);
    }
  };

  // ── export ────────────────────────────────────────────────────────────────
  const exportAs = async (fmt: "png" | "svg" | "json") => {
    const elements = (apiRef.current?.getSceneElements?.() ?? sceneRef.current.elements ?? []) as any[];
    if (!elements.length) {
      toast.error("Nothing to export");
      return;
    }
    const files = apiRef.current?.getFiles?.() ?? sceneRef.current.files ?? null;
    const name = (wb?.title || "whiteboard").replace(/\s+/g, "-").toLowerCase();
    try {
      const ex = await import("@excalidraw/excalidraw");
      if (fmt === "png") {
        const blob = await ex.exportToBlob({
          elements,
          appState: { exportBackground: true, viewBackgroundColor: "#ffffff" } as any,
          files,
          mimeType: "image/png",
        });
        triggerDownload(URL.createObjectURL(blob), `${name}.png`);
      } else if (fmt === "svg") {
        const svg = await ex.exportToSvg({
          elements,
          appState: { exportBackground: true, viewBackgroundColor: "#ffffff" } as any,
          files,
        });
        const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
        triggerDownload(URL.createObjectURL(blob), `${name}.svg`);
      } else {
        const json = ex.serializeAsJSON(elements, apiRef.current?.getAppState?.() ?? {}, files ?? {}, "local");
        const blob = new Blob([json], { type: "application/json" });
        triggerDownload(URL.createObjectURL(blob), `${name}.excalidraw`);
      }
    } catch {
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-violet" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="z-10 flex shrink-0 items-center gap-2 border-b border-border bg-background px-4 py-2.5">
        <Button variant="ghost" size="sm" onClick={() => navigate("/whiteboards")}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="h-8 max-w-xs border-transparent bg-transparent text-sm font-semibold hover:border-border focus:border-border"
        />
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {saving ? (
            <>
              <Loader2 className="size-3 animate-spin" /> Saving…
            </>
          ) : dirty ? (
            <>
              <Dot className="size-4 text-amber-500" /> Unsaved
            </>
          ) : (
            <>
              <Check className="size-3 text-emerald-500" /> Saved
            </>
          )}
        </span>
        {autosaveMode === "manual" && (
          <Button variant="outline" size="sm" onClick={flush} disabled={!dirty || saving}>
            <Save className="mr-1.5 size-4" /> Save
          </Button>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={!!busy}>
                {busy ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 size-4 text-violet" />
                )}
                AI
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setGenOpen(true)}>Generate diagram…</DropdownMenuItem>
              <DropdownMenuItem onClick={runExplain}>Explain this whiteboard</DropdownMenuItem>
              <DropdownMenuItem onClick={runExpand}>Expand selected node</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AddToNotebookMenu
            artifactType="whiteboard"
            content={null}
            sourceId={id}
            course={wb?.course || null}
            label="Add to notebook"
            customBlock={async () => ({
              type: "whiteboard",
              whiteboardId: id,
              title: wb?.title || title || "Whiteboard",
              thumbnail: (await sceneThumbnail(sceneRef.current)) ?? undefined,
            })}
          />

          <Button variant="outline" size="sm" onClick={saveRevision}>
            <Save className="mr-1.5 size-4" /> Save revision
          </Button>
          <Button variant="outline" size="sm" onClick={openHistory}>
            <History className="mr-1.5 size-4" /> History
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 size-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportAs("png")}>PNG image</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAs("svg")}>SVG vector</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportAs("json")}>Excalidraw (.excalidraw)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1">
        <ExcalidrawCanvas
          key={canvasKey}
          initialScene={sceneRef.current}
          onApiReady={(a) => (apiRef.current = a)}
          onChange={handleChange}
        />

        {/* History panel */}
        {historyOpen && (
          <div className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">Version history</span>
              <button onClick={() => setHistoryOpen(false)} className="rounded p-1 hover:bg-accent">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {revisions.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No revisions yet. Use “Save revision” to snapshot this canvas.
                </p>
              ) : (
                revisions.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">Revision {r.revisionNumber}</div>
                      <div className="truncate text-[11px] text-muted-foreground">
                        {r.changeSummary || r.createdAt}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => restore(r.revisionNumber)}>
                      <RotateCcw className="mr-1 size-3.5" /> Restore
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Generate dialog */}
      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate a diagram</DialogTitle>
          </DialogHeader>
          <Input
            value={genTopic}
            onChange={(e) => setGenTopic(e.target.value)}
            placeholder="e.g. Producer–consumer problem"
            onKeyDown={(e) => e.key === "Enter" && runGenerate(genTopic)}
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            ScholarAI drafts an editable diagram grounded in {wb?.course || "your"} material.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => runGenerate(genTopic)} disabled={!!busy}>
              {busy === "generate" && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Explain dialog */}
      <Dialog open={explainOpen} onOpenChange={setExplainOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Diagram explanation</DialogTitle>
          </DialogHeader>
          <div className={cn("max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm text-foreground/90")}>
            {explainText}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
