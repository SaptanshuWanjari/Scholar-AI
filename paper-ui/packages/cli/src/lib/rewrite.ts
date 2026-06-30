import path from 'node:path';
import { parseImports, classifyImport, resolveFile } from './graph';

export function rewriteSource(
  source: string,
  fromFile: string,
  srcRoot: string,
  alias: string,
): string {
  const utilsDir = path.join(srcRoot, 'utils');
  const coreDir = path.join(srcRoot, 'core');
  let out = source;

  for (const spec of parseImports(source)) {
    const target = mapSpec(spec, fromFile, srcRoot, alias, utilsDir, coreDir);
    if (target && target !== spec) {
      // Replace the quoted specifier exactly (both quote styles).
      out = out
        .split(`"${spec}"`).join(`"${target}"`)
        .split(`'${spec}'`).join(`'${target}'`);
    }
  }
  return out;
}

function mapSpec(
  spec: string,
  fromFile: string,
  srcRoot: string,
  alias: string,
  utilsDir: string,
  coreDir: string,
): string | null {
  const kind = classifyImport(spec);
  if (kind === 'utils') return spec.replace('@paper-ui/utils', `${alias}/utils`);
  if (kind === 'core') return spec.replace('@paper-ui/core', `${alias}/core`);
  if (kind === 'tokens') return spec.replace('@paper-ui/tokens', `${alias}/tokens`);
  if (kind === 'relative') {
    const resolved = resolveFile(fromFile, spec, srcRoot);
    if (!resolved) return null;
    if (resolved.startsWith(utilsDir)) return `${alias}/utils`;
    if (resolved.startsWith(coreDir)) return `${alias}/core`;
    return null; // cross-component relative import: keep as-is
  }
  return null;
}
