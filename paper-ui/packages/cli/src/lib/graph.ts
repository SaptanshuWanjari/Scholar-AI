export type ImportKind = 'core' | 'utils' | 'tokens' | 'relative' | 'npm';

const IMPORT_RE = /import\s+(?:[\w*${}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g;

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
