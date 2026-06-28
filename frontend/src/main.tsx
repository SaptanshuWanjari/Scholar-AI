
import { createRoot } from "react-dom/client";
import { pdfjs } from "react-pdf";
import App from "./app/App.tsx";
import "./styles/index.css";
import "katex/dist/katex.min.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

createRoot(document.getElementById("root")!).render(<App />);

  