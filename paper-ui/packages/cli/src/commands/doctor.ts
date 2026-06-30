import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { loadConfig } from '../lib/config';

export async function doctor() {
  const cwd = process.cwd();
  let config;
  try { config = loadConfig(cwd); }
  catch (e: any) { console.log(chalk.red(`✖ ${e.message}`)); return; }

  const checks: Array<[string, boolean]> = [
    ['components.json present', true],
    ['utils installed', fs.existsSync(path.resolve(cwd, config.utilsPath, 'cn.ts'))],
    ['core installed', fs.existsSync(path.resolve(cwd, config.corePath, 'PaperCard.tsx'))],
    ['tokens CSS installed', fs.existsSync(path.resolve(cwd, config.tokensPath))],
    ['registry reachable', fs.existsSync(path.resolve(cwd, config.registryDir))],
  ];
  for (const [label, ok] of checks) console.log(`${ok ? chalk.green('✔') : chalk.red('✖')} ${label}`);
  console.log(chalk.gray(`\nInstalled components: ${config.installed.join(', ') || '(none)'}`));
}
