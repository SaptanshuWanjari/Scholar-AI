import fs from 'node:fs';
import path from 'node:path';

export type ImportKind = 'core' | 'utils' | 'tokens' | 'relative' | 'npm';

// Matches `import ... from "x"`, side-effect `import "x"`, and `export ... from "x"`
// re-exports. A bare `export { x }` / `export const` (no `from`) has no trailing
// quoted specifier, so it never matches.
const IMPORT_RE = /(?:import|export)\s+(?:[\w*${}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g;

export function parseImports(source: string): string[] {
  const specs: string[] = [];
  let m: RegExpExecArray | null;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(source)) !== null) specs.push(m[1]);
  return specs;
}

export function classifyImport(spec: string): ImportKind {
  if (spec === '@paper-ui/core' || spec.startsWith('@paper-ui/core/')) return 'core';
  if (spec === '@paper-ui/utils' || spec.startsWith('@paper-ui/utils/')) return 'utils';
  if (spec === '@paper-ui/tokens' || spec.startsWith('@paper-ui/tokens/')) return 'tokens';
  if (spec.startsWith('.')) return 'relative';
  return 'npm';
}

export function packageName(spec: string): string {
  if (spec.startsWith('@')) {
    const parts = spec.split('/');
    return parts.slice(0, 2).join('/');
  }
  return spec.split('/')[0];
}

export function resolveFile(fromFile: string, spec: string, srcRoot: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base, base + '.tsx', base + '.ts',
    path.join(base, 'index.tsx'), path.join(base, 'index.ts'),
  ];
  for (const c of candidates) {
    if ((c === srcRoot || c.startsWith(srcRoot + path.sep)) && fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

export interface GraphResult {
  componentFiles: string[];
  needsCore: boolean;
  needsUtils: boolean;
  npmDeps: string[];
}

export function resolveFileGraph(entryFiles: string[], srcRoot: string): GraphResult {
  const componentsDir = path.join(srcRoot, 'components');
  const coreDir = path.join(srcRoot, 'core');
  const utilsDir = path.join(srcRoot, 'utils');

  const visited = new Set<string>();
  const npm = new Set<string>();
  let needsCore = false;
  let needsUtils = false;
  const queue = [...entryFiles];

  while (queue.length) {
    const file = queue.shift()!;
    if (visited.has(file)) continue;
    visited.add(file);

    const source = fs.readFileSync(file, 'utf8');
    for (const spec of parseImports(source)) {
      const kind = classifyImport(spec);
      if (kind === 'core') { needsCore = true; continue; }
      if (kind === 'utils') { needsUtils = true; continue; }
      if (kind === 'tokens') continue;
      if (kind === 'npm') { npm.add(packageName(spec)); continue; }
      // relative:
      const resolved = resolveFile(file, spec, srcRoot);
      if (!resolved) continue;
      if (resolved.startsWith(coreDir + path.sep)) { needsCore = true; continue; }
      if (resolved.startsWith(utilsDir + path.sep)) { needsUtils = true; continue; }
      if (resolved.startsWith(componentsDir) && !visited.has(resolved)) queue.push(resolved);
    }
  }

  return {
    componentFiles: [...visited].sort(),
    needsCore,
    needsUtils,
    npmDeps: [...npm].sort(),
  };
}
