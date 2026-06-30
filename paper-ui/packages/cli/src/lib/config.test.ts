import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { defaultConfig, loadConfig, writeConfig, CONFIG_FILE } from './config';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'paperui-'));
afterEach(() => { try { fs.rmSync(path.join(tmp, CONFIG_FILE)); } catch {} });

describe('config', () => {
  it('defaultConfig has expected paths', () => {
    const c = defaultConfig();
    expect(c.componentsPath).toBe('src/paper-ui/components');
    expect(c.alias).toBe('@/paper-ui');
    expect(c.installed).toEqual([]);
  });

  it('writes then loads round-trip', async () => {
    await writeConfig(tmp, { ...defaultConfig(), installed: ['buttons'] });
    const loaded = loadConfig(tmp);
    expect(loaded.installed).toEqual(['buttons']);
  });

  it('loadConfig throws a clear error when missing', () => {
    expect(() => loadConfig(path.join(tmp, 'nope'))).toThrow(/components\.json not found/);
  });
});
