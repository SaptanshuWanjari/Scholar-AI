import type { ReactBlockViewProps } from "../editor/ReactEmbedBlock";
import type { CalloutProps } from "../../../lib/blocksuite/schemas";
import { cn } from "@/paper-ui/utils";

const TONE: Record<CalloutProps["tone"], { ring: string; label: string }> = {
  note: { ring: "border-sky/40 bg-sky/10", label: "Note" },
  warning: { ring: "border-amber-400/50 bg-amber-50", label: "Warning" },
  insight: { ring: "border-emerald-400/50 bg-emerald-50", label: "Insight" },
};

export function CalloutView({ model, doc }: ReactBlockViewProps<any>) {
  const tone = (model.tone ?? "note") as CalloutProps["tone"];
  const t = TONE[tone];
  return (
    <div className={cn("rounded-lg border px-4 py-3 my-2", t.ring)}>
      <div className="mb-1 font-caveat text-xs uppercase tracking-wide text-ink/50">{t.label}</div>
      <div
        className="font-kalam text-[14px] leading-relaxed text-ink/85 outline-none"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => doc.updateBlock(model, { text: e.currentTarget.textContent ?? "" })}
      >
        {model.text}
      </div>
    </div>
  );
}
export default CalloutView;
