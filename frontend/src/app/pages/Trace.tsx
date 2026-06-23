import { RetrievalTracePanel } from "../components/RetrievalTracePanel";

export function Trace() {
  return (
    <div className="h-full max-h-screen overflow-hidden p-4">
      <div className="h-full border rounded-lg shadow-sm w-full max-w-3xl mx-auto bg-background">
        <RetrievalTracePanel />
      </div>
    </div>
  );
}
