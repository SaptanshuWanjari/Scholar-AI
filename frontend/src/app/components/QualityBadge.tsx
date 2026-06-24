import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gauge, ChevronDown, ChevronUp, AlertCircle, FileText } from "lucide-react";
import type { QualityScore } from "../lib/types";

// A deliberately subtle, non-gamified quality indicator: one muted chip showing
// the overall score, expanding to a breakdown of the objective sub-dimensions
// and any detected issues. No badges, XP, or leaderboards.

function tone(score: number): string {
  if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-rose-400 bg-rose-500/10 border-rose-500/20";
}

function barTone(score: number): string {
  if (score >= 80) return "bg-emerald-500/70";
  if (score >= 60) return "bg-amber-500/70";
  return "bg-rose-500/70";
}

const DIMENSIONS: { key: keyof QualityScore; label: string }[] = [
  { key: "coverage", label: "Coverage" },
  { key: "grounding", label: "Grounding" },
  { key: "structure", label: "Structure" },
  { key: "balance", label: "Balance" },
  { key: "diversity", label: "Diversity" },
  { key: "redundancy", label: "Redundancy" },
];

interface Props {
  score?: QualityScore | null;
  className?: string;
}

const QualityBadge: React.FC<Props> = ({ score, className }) => {
  const [open, setOpen] = useState(false);
  if (!score) return null;

  const dims = DIMENSIONS.map((d) => ({ ...d, value: score[d.key] as number | undefined })).filter(
    (d) => typeof d.value === "number"
  );

  return (
    <div className={`relative inline-block ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Artifact quality (objective estimate)"
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium transition-colors ${tone(
          score.overall
        )}`}
      >
        <Gauge className="w-3.5 h-3.5" />
        <span>Quality {score.overall}%</span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-64 rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur-xl p-3 shadow-xl"
          >
            <div className="space-y-2">
              {dims.map((d) => (
                <div key={d.key as string} className="flex items-center gap-2">
                  <span className="w-20 shrink-0 text-[11px] text-slate-400">{d.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barTone(d.value!)}`}
                      style={{ width: `${d.value}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[11px] font-medium text-slate-300">{d.value}%</span>
                </div>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {score.sourceChunks} chunks · {score.documents} docs
              </span>
            </div>

            {score.notes.length > 0 && (
              <div className="mt-2 space-y-1">
                {score.notes.map((n, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-amber-400/90">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QualityBadge;
