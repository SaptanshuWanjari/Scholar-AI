import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ServerCrash, CheckCircle2, RefreshCcw, Terminal } from "lucide-react";
import { PaperButton } from "@paper-ui/components/buttons";
import { LoadingPaper } from "@paper-ui/components/feedback";
import { PaperCard } from "@paper-ui/core";
import { PaperH2, PaperH3, PaperIconCircle } from "@paper-ui/core";
import { api, type HealthStatus } from "../../lib/api";

export function OnboardingSetup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.health();
      setStatus(res);

      // If everything is good, proceed to next step
      if (res.ollama_reachable && res.embed_available) {
        setTimeout(() => navigate("/onboarding/import"), 500);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f0e8] px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-lg flex-col"
      >
        <div className="mb-8 text-center">
          <PaperH2>Checking System Setup</PaperH2>
          <p className="mt-2 font-kalam text-[14px] text-ink-muted">
            Verifying your local AI engine is ready
          </p>
        </div>

        <PaperCard shadow="md" className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <LoadingPaper variant="dots" size="lg" label="Connecting to Ollama..." />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <PaperIconCircle tone="brick" size={48}>
                <ServerCrash size={22} />
              </PaperIconCircle>
              <PaperH3 className="mt-4">Backend Unreachable</PaperH3>
              <p className="mt-2 font-kalam text-[13px] text-ink-muted max-w-sm">
                Ensure the ScholarCLI backend server is running.
              </p>
              <div className="mt-6">
                <PaperButton tone="paper" onClick={checkHealth}>
                  <RefreshCcw size={14} /> Retry
                </PaperButton>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ollama check */}
              <div className="flex items-start gap-4">
                <PaperIconCircle
                  tone={status?.ollama_reachable ? "sage" : "brick"}
                  size={36}
                >
                  {status?.ollama_reachable ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <ServerCrash size={16} />
                  )}
                </PaperIconCircle>
                <div>
                  <p className="font-architect text-[15px] text-ink">Ollama Running</p>
                  <p className="font-kalam text-[13px] text-ink-muted mt-1">
                    {status?.ollama_reachable
                      ? "Successfully connected to local Ollama instance."
                      : "Could not connect to Ollama on localhost:11434."}
                  </p>
                  {!status?.ollama_reachable && (
                    <div className="mt-3 rounded bg-black/5 p-3">
                      <p className="font-architect text-[11px] text-ink-muted mb-2 flex items-center gap-1.5">
                        <Terminal size={11} /> Run in terminal:
                      </p>
                      <code className="font-mono text-[13px] text-ink">ollama serve</code>
                    </div>
                  )}
                </div>
              </div>

              {/* Embed model check */}
              {status?.ollama_reachable && (
                <div className="flex items-start gap-4">
                  <PaperIconCircle
                    tone={status.embed_available ? "sage" : "brick"}
                    size={36}
                  >
                    {status.embed_available ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <ServerCrash size={16} />
                    )}
                  </PaperIconCircle>
                  <div className="flex-1">
                    <p className="font-architect text-[15px] text-ink">
                      Embedding Model ({status.embed_model})
                    </p>
                    <p className="font-kalam text-[13px] text-ink-muted mt-1">
                      {status.embed_available
                        ? "Model is downloaded and ready for document indexing."
                        : "Required model is missing from your local Ollama."}
                    </p>
                    {!status.embed_available && (
                      <div className="mt-3 rounded bg-black/5 p-3">
                        <p className="font-architect text-[11px] text-ink-muted mb-2 flex items-center gap-1.5">
                          <Terminal size={11} /> Run in terminal:
                        </p>
                        <code className="font-mono text-[13px] text-ink">
                          ollama pull {status.embed_model}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(!status?.ollama_reachable || !status?.embed_available) && (
                <div className="pt-4 flex justify-end border-t border-[#e8e3d8] mt-2">
                  <PaperButton tone="dark" onClick={checkHealth}>
                    <RefreshCcw size={14} /> Check Again
                  </PaperButton>
                </div>
              )}
            </div>
          )}
        </PaperCard>
      </motion.div>
    </div>
  );
}
