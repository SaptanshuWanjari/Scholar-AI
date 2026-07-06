// Type stubs for optional plugin packages that may not be installed.
// These allow TypeScript to compile when the packages are missing.
// When a package IS installed, its own types take precedence.
// ponytail: @excalidraw/excalidraw is in package.json dependencies (v0.18.1),
// so its stubs below are redundant — package ships its own types.
// Keep them until we verify the package types cover all exports used in the codebase.

declare module "@excalidraw/excalidraw" {
  export const Excalidraw: any;
  export function exportToBlob(opts: any): Promise<Blob>;
  export function exportToSvg(opts: any): Promise<SVGSVGElement>;
  export function convertToExcalidrawElements(elements: any[]): any[];
  export function serializeAsJSON(elements: any[], appState: any, files: any, type: string): string;
}

declare module "@excalidraw/excalidraw/index.css" {}

declare module "@excalidraw/mermaid-to-excalidraw" {
  export function parseMermaidToExcalidraw(syntax: string, opts?: any): Promise<{
    elements: any[];
    files?: Record<string, any>;
  }>;
}
