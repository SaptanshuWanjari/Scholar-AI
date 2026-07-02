import { useEffect, useState } from "react";
import { toast } from "@/app/lib/toast";
import { api, type ConceptInspector } from "../../lib/api";

export function useConcept(conceptId: string) {
  const [concept, setConcept] = useState<ConceptInspector | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setConcept(null);
    api
      .getConcept(conceptId)
      .then((c) => {
        if (!cancelled) setConcept(c);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err instanceof Error ? err.message : "Failed to load concept");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conceptId]);

  return { concept, loading };
}
