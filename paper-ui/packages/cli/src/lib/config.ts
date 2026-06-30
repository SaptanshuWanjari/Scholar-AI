import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

export const CONFIG_FILE = 'components.json';

export interface ComponentsConfig {
  sourceRoot: string;
  registryDir: string;
  componentsPath: string;
  utilsPath: string;
  corePath: string;
  tokensPath: string;
  alias: string;
  installed: string[];
}

export function defaultConfig(): ComponentsConfig {
  return {
    sourceRoot: '../paper-ui',
    registryDir: '../paper-ui/registry',
    componentsPath: 'src/paper-ui/components',
    utilsPath: 'src/paper-ui/utils',
    corePath: 'src/paper-ui/core',
    tokensPath: 'src/styles/paper.css',
    alias: '@/paper-ui',
    installed: [],
  };
}

export function loadConfig(cwd: string): ComponentsConfig {
  const file = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(file)) {
    throw new Error(`components.json not found in ${cwd}. Run \`paper-ui init\` first.`);
  }
  return { ...defaultConfig(), ...JSON.parse(fs.readFileSync(file, 'utf8')) };
}

export async function writeConfig(cwd: string, cfg: ComponentsConfig): Promise<void> {
  await fsp.writeFile(path.join(cwd, CONFIG_FILE), JSON.stringify(cfg, null, 2) + '\n');
}
