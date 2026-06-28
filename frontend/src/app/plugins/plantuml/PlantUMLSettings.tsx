import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Copy, Check } from "lucide-react";
import { cn } from "../../components/ui/utils";

interface Status {
  installed: boolean;
  version: string | null;
}

const INSTALL_STEPS: { platform: string; commands: string[] }[] = [
  { platform: "macOS (Homebrew)", commands: ["brew install plantuml graphviz"] },
  { platform: "Ubuntu / Debian", commands: ["sudo apt update", "sudo apt install plantuml graphviz"] },
  { platform: "Arch Linux", commands: ["sudo pacman -S plantuml graphviz"] },
  {
    platform: "Manual (any OS)",
    commands: [
      "# 1. Install Java: https://adoptium.net",
      "# 2. Install Graphviz: https://graphviz.org/download",
      "# 3. Download plantuml.jar: https://plantuml.com/download",
      "# 4. Add alias to shell profile:",
      'alias plantuml="java -jar /path/to/plantuml.jar"',
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={copy}
      className="ml-auto shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
      title="Copy"
    >
      {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function PlantUMLSettings() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch("/api/plugins/plantuml/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ installed: false, version: null }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Checking installation…</span>
          </>
        ) : status?.installed ? (
          <>
            <CheckCircle2 className="size-4 text-green-500" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              PlantUML detected
            </span>
            {status.version && (
              <span className="ml-1 font-mono text-[10px] text-muted-foreground">
                {status.version}
              </span>
            )}
          </>
        ) : (
          <>
            <XCircle className="size-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              PlantUML not found in PATH
            </span>
          </>
        )}
      </div>

      {/* Install guide — shown only when not installed */}
      {!loading && !status?.installed && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-foreground">Installation</p>

          {/* Platform tabs */}
          <div className="flex flex-wrap gap-1">
            {INSTALL_STEPS.map((step, i) => (
              <button
                key={step.platform}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  activeTab === i
                    ? "bg-violet text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {step.platform}
              </button>
            ))}
          </div>

          {/* Commands */}
          <div className="space-y-1.5">
            {INSTALL_STEPS[activeTab].commands.map((cmd) => (
              <div
                key={cmd}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 font-mono text-xs"
              >
                <span className={cn("flex-1", cmd.startsWith("#") && "text-muted-foreground")}>
                  {cmd}
                </span>
                {!cmd.startsWith("#") && <CopyButton text={cmd} />}
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground">
            After installing, reload this page and re-check status above.
          </p>
        </div>
      )}

      {/* How it works */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-foreground">How it works</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex gap-2">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-violet/60" />
            Ask AI for a UML diagram, sequence flow, or architecture — it generates PlantUML syntax.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-violet/60" />
            The backend renders it locally via the <code className="rounded bg-muted px-1 text-[11px]">plantuml</code> binary and returns an SVG.
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-violet/60" />
            Toggle <span className="font-medium text-foreground">View Source</span> on any diagram to inspect or copy the raw syntax.
          </li>
        </ul>
      </div>

      {/* Supported diagram types */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-foreground">Supported diagram types</p>
        <div className="flex flex-wrap gap-1.5">
          {["Sequence", "Class", "Component", "State machine", "Activity", "Use case", "Deployment"].map((t) => (
            <span
              key={t}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
