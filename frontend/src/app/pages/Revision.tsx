import { useState } from "react";
import { Sparkles, NotebookPen, FileText, Sigma, ListTree, Download, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { courses } from "../lib/mock-data";
import { cn } from "../components/ui/utils";

const formats = [
  { id: "notes", label: "Exam Notes", icon: NotebookPen },
  { id: "concepts", label: "Key Concepts", icon: ListTree },
  { id: "formulas", label: "Formula Sheet", icon: Sigma },
  { id: "summary", label: "Summary Sheet", icon: FileText },
];

const generated: Record<string, string> = {
  notes: `# Exam Notes — Neural Networks

## 1. Backpropagation
Backpropagation computes the **gradient of the loss** w.r.t. each weight via the chain rule, propagating errors backward through layers.

- Forward pass → prediction & loss
- Backward pass → local gradients
- Update → \`w = w - η·∇L\`

## 2. Optimization
- **Batch GD**: stable but slow
- **Mini-batch**: best balance (32–512)
- **SGD**: noisy but fast

> Watch the learning rate η — too high diverges, too low crawls.`,
  concepts: `# Key Concepts

- **Gradient** — direction of steepest ascent of the loss.
- **Learning rate (η)** — step size of each weight update.
- **Activation function** — introduces non-linearity (ReLU, sigmoid, tanh).
- **Softmax** — converts logits into a probability distribution.
- **Overfitting** — model memorizes training data; mitigated by regularization.`,
  formulas: `# Formula Sheet

**Weight update**
\`\`\`
w ← w - η · ∂L/∂w
\`\`\`

**Softmax**
\`\`\`
σ(z)_i = e^{z_i} / Σ_j e^{z_j}
\`\`\`

**Cross-entropy loss**
\`\`\`
L = -Σ_i y_i · log(ŷ_i)
\`\`\`

**Sigmoid**
\`\`\`
σ(x) = 1 / (1 + e^{-x})
\`\`\``,
  summary: `# Summary Sheet

Neural networks learn by **iteratively minimizing a loss** using gradients computed through backpropagation. Training alternates forward and backward passes, nudging weights by the learning rate. Key levers are architecture depth, activation choice, batch size and η. Regularization keeps the model from overfitting so it generalizes to unseen exam-style questions.`,
};

export function Revision() {
  const [format, setFormat] = useState("notes");
  const [course, setCourse] = useState(courses[0].name);
  const [depth, setDepth] = useState([3]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(generated.notes);

  const generate = () => {
    setLoading(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(generated[format]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex h-full">
      {/* Generator */}
      <div className="w-96 shrink-0 overflow-y-auto border-r border-border bg-card/40 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h3>Generator</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn your materials into exam-ready study resources.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <Label className="mb-2 block">Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-colors",
                    format === f.id
                      ? "border-primary bg-violet-soft"
                      : "border-border bg-card hover:border-ring/40",
                  )}
                >
                  <f.icon className={cn("size-4", format === f.id ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-sm">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Course</Label>
            <Select value={course} onValueChange={setCourse}>
              <SelectTrigger className="bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Detail level</Label>
              <span className="text-xs text-muted-foreground">
                {["Minimal", "Concise", "Balanced", "Detailed", "Exhaustive"][depth[0] - 1]}
              </span>
            </div>
            <Slider value={depth} onValueChange={setDepth} min={1} max={5} step={1} />
          </div>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          <span className="text-sm font-medium">Preview</span>
          {output && (
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="size-3.5" /> Export
            </Button>
          )}
        </div>
        <div className="mx-auto max-w-3xl px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center pt-24 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-3 text-sm">Synthesizing your study sheet…</p>
            </div>
          ) : output ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <MarkdownRenderer content={output} />
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
