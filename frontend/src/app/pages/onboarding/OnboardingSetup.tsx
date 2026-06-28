import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ServerCrash, CheckCircle2, Loader2, RefreshCcw, Terminal } from "lucide-react";
import { Button } from "../../components/ui/button";
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
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-lg flex-col"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Checking System Setup
          </h1>
          <p className="mt-2 text-muted-foreground">
            Verifying your local AI engine is ready
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
              <p className="mt-4 text-sm font-medium">Connecting to Ollama...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                <ServerCrash className="size-6" />
              </div>
              <h3 className="text-lg font-semibold">Backend Unreachable</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                Ensure the ScholarCLI backend server is running.
              </p>
              <Button onClick={checkHealth} variant="outline" className="mt-6 gap-2">
                <RefreshCcw className="size-4" /> Retry
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${status?.ollama_reachable ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                  {status?.ollama_reachable ? <CheckCircle2 className="size-5" /> : <ServerCrash className="size-5" />}
                </div>
                <div>
                  <h3 className="font-medium">Ollama Running</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {status?.ollama_reachable 
                      ? "Successfully connected to local Ollama instance." 
                      : "Could not connect to Ollama on localhost:11434."}
                  </p>
                  {!status?.ollama_reachable && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5"><Terminal className="size-3" /> Run in terminal:</p>
                      <code className="text-sm font-mono text-foreground">ollama serve</code>
                    </div>
                  )}
                </div>
              </div>

              {status?.ollama_reachable && (
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${status.embed_available ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                    {status.embed_available ? <CheckCircle2 className="size-5" /> : <ServerCrash className="size-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Embedding Model ({status.embed_model})</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {status.embed_available 
                        ? "Model is downloaded and ready for document indexing." 
                        : "Required model is missing from your local Ollama."}
                    </p>
                    {!status.embed_available && (
                      <div className="mt-3 rounded-md bg-muted p-3">
                        <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1.5"><Terminal className="size-3" /> Run in terminal:</p>
                        <code className="text-sm font-mono text-foreground">ollama pull {status.embed_model}</code>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {(!status?.ollama_reachable || !status?.embed_available) && (
                <div className="pt-4 flex justify-end border-t border-border mt-6">
                  <Button onClick={checkHealth} className="gap-2">
                    <RefreshCcw className="size-4" /> Check Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
