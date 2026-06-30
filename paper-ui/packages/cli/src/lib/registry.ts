import path from 'node:path';

export interface RegistryEntry {
  name: string;
  category: string;
  files: string[];
  registryDependencies: string[];
  core: boolean;
  utils: boolean;
  npmDependencies: string[];
}

/** Component name used as a registry key. `Foo.tsx` -> "foo"; `dir/index.tsx` -> "dir". */
export function entryNameForFile(absFile: string, srcRoot: string): string {
  const base = path.basename(absFile, path.extname(absFile));
  if (base === 'index') return path.basename(path.dirname(absFile)).toLowerCase();
  return base.toLowerCase();
}
