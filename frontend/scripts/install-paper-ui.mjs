#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.resolve(__dirname, "..");
const SRC_ROOT = path.resolve(CWD, "../paper-ui/src");
const REGISTRY_DIR = path.resolve(CWD, "../paper-ui/registry");
const COMPONENTS_SRC = path.join(SRC_ROOT, "components");
const COMPONENTS_DEST = path.resolve(CWD, "src/paper-ui/components");
const CONFIG_PATH = path.resolve(CWD, "components.json");

const IMPORT_RE = /(?:import|export)\s+(?:[\w*${}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g;

function parseImports(source) {
  const specs = [];
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(source)) !== null) specs.push(m[1]);
  return specs;
}

function classifyImport(spec) {
  if (spec === "@paper-ui/core" || spec.startsWith("@paper-ui/core/")) return "core";
  if (spec === "@paper-ui/utils" || spec.startsWith("@paper-ui/utils/")) return "utils";
  if (spec === "@paper-ui/tokens" || spec.startsWith("@paper-ui/tokens/")) return "tokens";
  if (spec.startsWith(".")) return "relative";
  return "npm";
}

function resolveFile(fromFile, spec) {
  if (!spec.startsWith(".")) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base, base + ".tsx", base + ".ts",
    path.join(base, "index.tsx"), path.join(base, "index.ts"),
  ];
  for (const c of candidates) {
    if ((c === SRC_ROOT || c.startsWith(SRC_ROOT + path.sep)) && fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

function resolveFileGraph(entryFiles) {
  const componentsDir = path.join(SRC_ROOT, "components");
  const coreDir = path.join(SRC_ROOT, "core");
  const utilsDir = path.join(SRC_ROOT, "utils");
  const visited = new Set();
  const npm = new Set();
  let needsCore = false, needsUtils = false;
  const queue = [...entryFiles];
  while (queue.length) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);
    const source = fs.readFileSync(file, "utf8");
    for (const spec of parseImports(source)) {
      const kind = classifyImport(spec);
      if (kind === "core") { needsCore = true; continue; }
      if (kind === "utils") { needsUtils = true; continue; }
      if (kind === "tokens") continue;
      if (kind === "npm") { npm.add(spec.split("/")[0].startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]); continue; }
      const resolved = resolveFile(file, spec);
      if (!resolved) continue;
      if (resolved.startsWith(coreDir)) { needsCore = true; continue; }
      if (resolved.startsWith(utilsDir)) { needsUtils = true; continue; }
      if (resolved.startsWith(componentsDir) && !visited.has(resolved)) queue.push(resolved);
    }
  }
  return { componentFiles: [...visited].sort(), needsCore, needsUtils, npmDeps: [...npm].sort() };
}

function rewriteSource(source, fromFile) {
  const utilsDir = path.join(SRC_ROOT, "utils");
  const coreDir = path.join(SRC_ROOT, "core");
  let out = source;
  for (const spec of parseImports(source)) {
    const kind = classifyImport(spec);
    let target = null;
    if (kind === "utils") target = spec.replace("@paper-ui/utils", "@/paper-ui/utils");
    else if (kind === "core") target = spec.replace("@paper-ui/core", "@/paper-ui/core");
    else if (kind === "tokens") target = spec.replace("@paper-ui/tokens", "@/paper-ui/tokens");
    else if (kind === "relative") {
      const resolved = resolveFile(fromFile, spec);
      if (resolved) {
        if (resolved.startsWith(utilsDir)) target = "@/paper-ui/utils";
        else if (resolved.startsWith(coreDir)) target = "@/paper-ui/core";
      }
    }
    if (target && target !== spec) {
      out = out.split(`"${spec}"`).join(`"${target}"`).split(`'${spec}'`).join(`'${target}'`);
    }
  }
  return out;
}

async function main() {
  const names = process.argv.slice(2);
  if (names.length === 0) { console.error("Usage: node install-paper-ui.mjs <component-name> [...]"); process.exit(1); }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const entryFiles = [];

  for (const name of names) {
    const jsonPath = path.join(REGISTRY_DIR, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(jsonPath)) { console.error(`Component "${name}" not found in registry.`); process.exit(1); }
    const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    entryFiles.push(path.join(SRC_ROOT, entry.files[0]));
  }

  const graph = resolveFileGraph(entryFiles);
  let written = 0, skipped = 0;

  for (const abs of graph.componentFiles) {
    const rel = path.relative(COMPONENTS_SRC, abs);
    const dest = path.resolve(COMPONENTS_DEST, rel);
    if (fs.existsSync(dest)) { skipped++; continue; }
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    const rewritten = rewriteSource(fs.readFileSync(abs, "utf8"), abs);
    await fsp.writeFile(dest, rewritten);
    written++;
  }

  const installed = new Set(config.installed.map((n) => n.toLowerCase()));
  for (const abs of graph.componentFiles) {
    const base = path.basename(abs, path.extname(abs));
    const entryName = base === "index" ? path.basename(path.dirname(abs)).toLowerCase() : base.toLowerCase();
    installed.add(entryName);
  }
  config.installed = [...installed].sort();
  await fsp.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

  console.log(`Installed ${names.join(", ")}: ${written} files written, ${skipped} already exist`);
  if (graph.npmDeps.length) console.log(`Note: npm deps used: ${graph.npmDeps.join(", ")}`);
  if (graph.needsCore) console.log("Note: needs core (already installed)");
  if (graph.needsUtils) console.log("Note: needs utils (already installed)");
}

main().catch((err) => { console.error(err.message); process.exit(1); });
