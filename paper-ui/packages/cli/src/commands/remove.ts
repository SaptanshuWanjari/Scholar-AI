import chalk from 'chalk';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, writeConfig } from '../lib/config';

export async function remove(component?: string) {
  const cwd = process.cwd();
  if (!component) { console.log(chalk.red('No component specified.')); return; }

  let config;
  try { config = loadConfig(cwd); }
  catch (e: any) { console.log(chalk.red(e.message)); return; }

  const registryDir = path.resolve(cwd, config.registryDir);
  const jsonPath = path.join(registryDir, `${component.toLowerCase()}.json`);
  if (!fs.existsSync(jsonPath)) { console.log(chalk.red(`Unknown component "${component}".`)); return; }

  const entry = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  for (const relFromSrc of entry.files as string[]) {
    const rel = relFromSrc.replace(/^components\//, '');
    const dest = path.resolve(cwd, config.componentsPath, rel);
    if (fs.existsSync(dest)) await fsp.rm(dest);
  }
  await writeConfig(cwd, { ...config, installed: config.installed.filter((n) => n !== component.toLowerCase()) });
  console.log(chalk.green(`Removed ${component}. (Dependencies left in place.)`));
}
