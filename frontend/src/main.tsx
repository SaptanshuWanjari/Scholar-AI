// @ts-expect-error ponytail: missing @types/react-dom, works at runtime
import { createRoot } from "react-dom/client";
import { pdfjs } from "react-pdf";
import { ThemeProvider } from "next-themes";
import App from "./app/App.tsx";
import { useLogStore } from "./app/stores/useLogStore";
import "./styles/index.css";
import "katex/dist/katex.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// Intercept unhandled errors
window.addEventListener("error", (event) => {
  useLogStore.getState().addLog("error", event.message, event.error?.stack || "");
});

window.addEventListener("unhandledrejection", (event) => {
  useLogStore.getState().addLog("error", "Unhandled Promise Rejection", String(event.reason));
});


import { SWRConfig } from "swr";
import { fetcher } from "./app/lib/api";

createRoot(document.getElementById("root")!).render(
  <SWRConfig value={{ 
    fetcher,
    provider: () => new Map(), // No persistent cache
    keepPreviousData: false
  }}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </SWRConfig>
);