import { createRoot } from "react-dom/client";
import { pdfjs } from "react-pdf";
import { ThemeProvider } from "next-themes";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import "./styles/index.css";
import "katex/dist/katex.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";


import { SWRConfig } from "swr";
import { fetcher } from "./app/lib/api";

createRoot(document.getElementById("root")!).render(
  <SWRConfig value={{ 
    fetcher,
    provider: () => new Map(), // No persistent cache
    keepPreviousData: false
  }}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light" disableTransitionOnChange>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ThemeProvider>
  </SWRConfig>
);
