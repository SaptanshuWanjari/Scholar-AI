import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, writeConfig } from '../lib/config';
import { resolveFileGraph } from '../lib/graph';
import { rewriteSource } from '../lib/rewrite';
import { entryNameForFile } from '../lib/registry';

export async function add(...args: string[]) {
  // commander passes (component, options, command); keep only string names.
  let names = args.filter((a) => typeof a === 'string');
  const cwd = process.cwd();

  let config;
  try { config = loadConfig(cwd); }
  catch (e: any) { console.log(chalk.red(e.message)); return; }

  if (names.length === 0) {
    const r = await prompts({ type: 'text', name: 'component', message: 'Which component(s) to add? (space-separated)' });
    names = (r.component || '').split(/\s+/).filter(Boolean);
  }
  if (names.length === 0) { console.log(chalk.red('No component selected.')); return; }

  const srcRoot = path.resolve(cwd, config.sourceRoot, 'src');
  const registryDir = path.resolve(cwd, config.registryDir);

  // Map requested name -> entry JSON -> first file (BFS entry point).
  const entryFiles: string[] = [];
  for (const name of names) {
    const jsonPath = path.join(registryDir, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(jsonPath)) { console.log(chalk.red(`Component "${name}" not found in registry.`)); return; }
    const entry = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    entryFiles.push(path.join(srcRoot, entry.files[0]));
  }

  const spinner = ora(`Adding ${names.join(', ')}...`).start();
  try {
    const graph = resolveFileGraph(entryFiles, srcRoot);
    const componentsRoot = path.join(srcRoot, 'components');
    let written = 0;

    for (const abs of graph.componentFiles) {
      const rel = path.relative(componentsRoot, abs);           // e.g. cards/MetricCard.tsx
      const dest = path.resolve(cwd, config.componentsPath, rel);
      if (fs.existsSync(dest)) continue;                        // never clobber edited files
      await fsp.mkdir(path.dirname(dest), { recursive: true });
      const rewritten = rewriteSource(fs.readFileSync(abs, 'utf8'), abs, srcRoot, config.alias);
      await fsp.writeFile(dest, rewritten);
      written++;
    }

    const installed = new Set(config.installed);
    for (const abs of graph.componentFiles) installed.add(entryNameForFile(abs, srcRoot));
    await writeConfig(cwd, { ...config, installed: [...installed].sort() });

    spinner.succeed(`Added ${names.join(', ')} (${written} files).`);
    if (graph.npmDeps.length) {
      console.log(chalk.gray('\nInstall peer dependencies:'));
      console.log(chalk.cyan(`npm install ${graph.npmDeps.join(' ')}\n`));
    }
  } catch (err: any) {
    spinner.fail('Failed to add component');
    console.error(chalk.red(err.message));
  }
}
