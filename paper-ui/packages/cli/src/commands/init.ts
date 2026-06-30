import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { defaultConfig, writeConfig, type ComponentsConfig } from '../lib/config';
import { rewriteSource } from '../lib/rewrite';

async function copyDir(srcDir: string, destDir: string, transform?: (src: string, file: string) => string) {
  await fsp.mkdir(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, name);
    const stat = fs.statSync(from);
    if (stat.isDirectory()) { await copyDir(from, to, transform); continue; }
    let contents = fs.readFileSync(from, 'utf8');
    if (transform && (name.endsWith('.ts') || name.endsWith('.tsx'))) contents = transform(contents, from);
    await fsp.writeFile(to, contents);
  }
}

export async function init() {
  console.log(chalk.bold('Initializing Paper UI...\n'));
  const cwd = process.cwd();
  const base = defaultConfig();

  const response = await prompts([
    { type: 'text', name: 'sourceRoot', message: 'Path to the paper-ui package?', initial: base.sourceRoot },
    { type: 'text', name: 'componentsPath', message: 'Install components to?', initial: base.componentsPath },
  ]);
  if (!response.sourceRoot || !response.componentsPath) {
    console.log(chalk.red('\nInitialization cancelled.'));
    return;
  }

  const cfg: ComponentsConfig = { ...base, ...response };
  const srcRoot = path.resolve(cwd, cfg.sourceRoot, 'src');
  const spinner = ora('Copying foundation...').start();

  try {
    // utils + core (rewrite @paper-ui/* imports inside them)
    await copyDir(path.join(srcRoot, 'utils'), path.resolve(cwd, cfg.utilsPath),
      (src, file) => rewriteSource(src, file, srcRoot, cfg.alias));
    await copyDir(path.join(srcRoot, 'core'), path.resolve(cwd, cfg.corePath),
      (src, file) => rewriteSource(src, file, srcRoot, cfg.alias));
    // tokens CSS
    const tokensDest = path.resolve(cwd, cfg.tokensPath);
    await fsp.mkdir(path.dirname(tokensDest), { recursive: true });
    await fsp.copyFile(path.join(srcRoot, 'tokens', 'paper.css'), tokensDest);

    await writeConfig(cwd, cfg);
    spinner.succeed('Foundation installed and components.json written.');
    console.log(chalk.green('\nPaper UI initialized.'));
    console.log(`Import the tokens once, e.g. add ${chalk.cyan(`@import './paper.css';`)} near your global CSS.`);
    console.log(`Then run ${chalk.cyan('paper-ui add <component>')}.`);
  } catch (err: any) {
    spinner.fail('Initialization failed');
    console.error(chalk.red(err.message));
  }
}
