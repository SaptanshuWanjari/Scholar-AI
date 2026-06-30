import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { resolveFileGraph } from '../lib/graph';
import { entryNameForFile, type RegistryEntry } from '../lib/registry';

// Run from paper-ui root: `npm run build:registry` (cwd = paper-ui).
const SRC = path.resolve(process.cwd(), 'src');
const COMPONENTS = path.join(SRC, 'components');
const REGISTRY = path.resolve(process.cwd(), 'registry');

function listComponentFiles(): string[] {
  const out: string[] = [];
  for (const category of fs.readdirSync(COMPONENTS)) {
    const dir = path.join(COMPONENTS, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.tsx')) continue;
      // index.tsx barrels are included (e.g. doodles) — they are real entries.
      out.push(path.join(dir, file));
    }
  }
  return out;
}

async function main() {
  await fsp.mkdir(REGISTRY, { recursive: true });
  const files = listComponentFiles();

  for (const file of files) {
    const name = entryNameForFile(file, SRC);
    const category = path.basename(path.dirname(file));
    const g = resolveFileGraph([file], SRC);
    const deps = new Set<string>();
    for (const f of g.componentFiles) {
      if (f === file) continue;
      deps.add(entryNameForFile(f, SRC));
    }
    const entry: RegistryEntry = {
      name,
      category,
      files: [path.relative(SRC, file)],
      registryDependencies: [...deps].sort(),
      core: g.needsCore,
      utils: g.needsUtils,
      npmDependencies: g.npmDeps,
    };
    await fsp.writeFile(path.join(REGISTRY, `${name}.json`), JSON.stringify(entry, null, 2) + '\n');
  }
  console.log(`Built registry for ${files.length} components.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
