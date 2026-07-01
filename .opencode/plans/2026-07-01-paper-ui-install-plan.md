# Paper UI Component Installation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Copy all ~170 paper-ui components from `paper-ui/src/` into `frontend/src/paper-ui/` as local copies (rewritten imports), category by category, with barrel exports.

**Architecture:** A self-contained Node.js script (`frontend/scripts/install-paper-ui.mjs`) replicates the paper-ui CLI's logic (import parsing, transitive dependency resolution, `@paper-ui/*` → `@/paper-ui/*` rewrite). Each category is installed separately, after which barrel `index.ts` files are created and the TypeScript build is verified.

**Tech Stack:** Node.js (script), React/TypeScript (components), paper-ui registry JSON

---

### Task 1: Create the install script

**Files:**

- Create: `frontend/scripts/install-paper-ui.mjs`
- Modify: `frontend/components.json` (updated by script)

**Step 1: Write the script**

Create `frontend/scripts/install-paper-ui.mjs`:

```js
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

const IMPORT_RE =
  /(?:import|export)\s+(?:[\w*${}\n\r\t, ]+\s+from\s+)?["']([^"']+)["']/g;

function parseImports(source) {
  const specs = [];
  let m;
  IMPORT_RE.lastIndex = 0;
  while ((m = IMPORT_RE.exec(source)) !== null) specs.push(m[1]);
  return specs;
}

function classifyImport(spec) {
  if (spec === "@paper-ui/core" || spec.startsWith("@paper-ui/core/"))
    return "core";
  if (spec === "@paper-ui/utils" || spec.startsWith("@paper-ui/utils/"))
    return "utils";
  if (spec === "@paper-ui/tokens" || spec.startsWith("@paper-ui/tokens/"))
    return "tokens";
  if (spec.startsWith(".")) return "relative";
  return "npm";
}

function resolveFile(fromFile, spec) {
  if (!spec.startsWith(".")) return null;
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    base + ".tsx",
    base + ".ts",
    path.join(base, "index.tsx"),
    path.join(base, "index.ts"),
  ];
  for (const c of candidates) {
    if (
      (c === SRC_ROOT || c.startsWith(SRC_ROOT + path.sep)) &&
      fs.existsSync(c) &&
      fs.statSync(c).isFile()
    )
      return c;
  }
  return null;
}

function resolveFileGraph(entryFiles) {
  const componentsDir = path.join(SRC_ROOT, "components");
  const coreDir = path.join(SRC_ROOT, "core");
  const utilsDir = path.join(SRC_ROOT, "utils");
  const visited = new Set();
  const npm = new Set();
  let needsCore = false,
    needsUtils = false;
  const queue = [...entryFiles];
  while (queue.length) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);
    const source = fs.readFileSync(file, "utf8");
    for (const spec of parseImports(source)) {
      const kind = classifyImport(spec);
      if (kind === "core") {
        needsCore = true;
        continue;
      }
      if (kind === "utils") {
        needsUtils = true;
        continue;
      }
      if (kind === "tokens") continue;
      if (kind === "npm") {
        npm.add(
          spec.split("/")[0].startsWith("@")
            ? spec.split("/").slice(0, 2).join("/")
            : spec.split("/")[0],
        );
        continue;
      }
      const resolved = resolveFile(file, spec);
      if (!resolved) continue;
      if (resolved.startsWith(coreDir)) {
        needsCore = true;
        continue;
      }
      if (resolved.startsWith(utilsDir)) {
        needsUtils = true;
        continue;
      }
      if (resolved.startsWith(componentsDir) && !visited.has(resolved))
        queue.push(resolved);
    }
  }
  return {
    componentFiles: [...visited].sort(),
    needsCore,
    needsUtils,
    npmDeps: [...npm].sort(),
  };
}

function rewriteSource(source, fromFile) {
  const utilsDir = path.join(SRC_ROOT, "utils");
  const coreDir = path.join(SRC_ROOT, "core");
  let out = source;
  for (const spec of parseImports(source)) {
    const kind = classifyImport(spec);
    let target = null;
    if (kind === "utils")
      target = spec.replace("@paper-ui/utils", "@/paper-ui/utils");
    else if (kind === "core")
      target = spec.replace("@paper-ui/core", "@/paper-ui/core");
    else if (kind === "tokens")
      target = spec.replace("@paper-ui/tokens", "@/paper-ui/tokens");
    else if (kind === "relative") {
      const resolved = resolveFile(fromFile, spec);
      if (resolved) {
        if (resolved.startsWith(utilsDir)) target = "@/paper-ui/utils";
        else if (resolved.startsWith(coreDir)) target = "@/paper-ui/core";
      }
    }
    if (target && target !== spec) {
      out = out
        .split(`"${spec}"`)
        .join(`"${target}"`)
        .split(`'${spec}'`)
        .join(`'${target}'`);
    }
  }
  return out;
}

async function main() {
  const names = process.argv.slice(2);
  if (names.length === 0) {
    console.error("Usage: node install-paper-ui.mjs <component-name> [...]");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const entryFiles = [];

  for (const name of names) {
    const jsonPath = path.join(REGISTRY_DIR, `${name.toLowerCase()}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.error(`Component "${name}" not found in registry.`);
      process.exit(1);
    }
    const entry = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    entryFiles.push(path.join(SRC_ROOT, entry.files[0]));
  }

  const graph = resolveFileGraph(entryFiles);
  let written = 0,
    skipped = 0;

  for (const abs of graph.componentFiles) {
    const rel = path.relative(COMPONENTS_SRC, abs);
    const dest = path.resolve(COMPONENTS_DEST, rel);
    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    const rewritten = rewriteSource(fs.readFileSync(abs, "utf8"), abs);
    await fsp.writeFile(dest, rewritten);
    written++;
  }

  const installed = new Set(config.installed.map((n) => n.toLowerCase()));
  for (const abs of graph.componentFiles) {
    const base = path.basename(abs, path.extname(abs));
    const entryName =
      base === "index"
        ? path.basename(path.dirname(abs)).toLowerCase()
        : base.toLowerCase();
    installed.add(entryName);
  }
  config.installed = [...installed].sort();
  await fsp.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

  console.log(
    `Installed ${names.join(", ")}: ${written} files written, ${skipped} already exist`,
  );
  if (graph.npmDeps.length)
    console.log(`Note: npm deps used: ${graph.npmDeps.join(", ")}`);
  if (graph.needsCore) console.log("Note: needs core (already installed)");
  if (graph.needsUtils) console.log("Note: needs utils (already installed)");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
```

**Step 2: Make executable**

```bash
chmod +x frontend/scripts/install-paper-ui.mjs
```

**Step 3: Test**

```bash
cd frontend && node scripts/install-paper-ui.mjs buttons
```

Expected: "Installed buttons: 0 files written, N already exist"

---

### Task 2: Create barrel index.ts helper

**Files:**

- Create: `frontend/scripts/create-barrel.mjs`

**Step 2.1: Write script**

```js
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.resolve(__dirname, "..");
const CATEGORY = process.argv[2];
if (!CATEGORY) {
  console.error("Usage: node create-barrel.mjs <category>");
  process.exit(1);
}

const srcBarrel = path.resolve(
  CWD,
  "../paper-ui/src/components",
  CATEGORY,
  "index.ts",
);
const destBarrel = path.resolve(
  CWD,
  "src/paper-ui/components",
  CATEGORY,
  "index.ts",
);

if (!fs.existsSync(srcBarrel)) {
  console.error(`No source barrel for category "${CATEGORY}"`);
  process.exit(1);
}

let content = fs.readFileSync(srcBarrel, "utf8");
content = content.replace(
  /from\s+"@paper-ui\/core"/g,
  'from "@/paper-ui/core"',
);
content = content.replace(
  /from\s+"@paper-ui\/utils"/g,
  'from "@/paper-ui/utils"',
);

fs.mkdirSync(path.dirname(destBarrel), { recursive: true });
fs.writeFileSync(destBarrel, content);
console.log(`Created barrel: ${destBarrel}`);
```

**Step 2.2: Make executable**

```bash
chmod +x frontend/scripts/create-barrel.mjs
```

---

### Task 3-22: Install categories

For each category below, run the two commands (install + barrel). The order minimizes risk — start with standalone categories, then dependent ones.

#### 3. badges

```bash
cd frontend && node scripts/install-paper-ui.mjs paperbadge categorytag coursetag difficultybadge pill prioritybadge statusbadge typetag
node scripts/create-barrel.mjs badges
```

#### 4. inputs

```bash
cd frontend && node scripts/install-paper-ui.mjs paperinput papercheckbox papercommandpalette paperlabel paperradio paperselect paperslider paperswitch sketchsearch
node scripts/create-barrel.mjs inputs
```

#### 5. dialogs

```bash
cd frontend && node scripts/install-paper-ui.mjs confirmationdialog contextmenu paperdrawer paperdropdown papermodal paperpopover papertooltip
node scripts/create-barrel.mjs dialogs
```

#### 6. navigation

```bash
cd frontend && node scripts/install-paper-ui.mjs accordion commandbar menubar papersidebar sidebar tabs topbar
node scripts/create-barrel.mjs navigation
```

#### 7. layout

```bash
cd frontend && node scripts/install-paper-ui.mjs appshell box container dashboardlayout flex footer papergrid pinnedsection resizablepanels scrollarea section sidelayout splitlayout stack surface workspace
node scripts/create-barrel.mjs layout
```

#### 8. feedback

```bash
cd frontend && node scripts/install-paper-ui.mjs emptystate errorcard illustratedemptystate loadingpaper papertoast sketchskeleton successbanner
node scripts/create-barrel.mjs feedback
```

#### 9. cards (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs actioncard artifactcard conceptcard coursecard documentcard learningpathcard notebookcard plugincard recommendationcard statscard summarycard papersheetcard
node scripts/create-barrel.mjs cards
```

#### 10. decorations (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs coffeering notebookedge notebookspiral paperclip paperstamp scribble tapelabel washitapes
node scripts/create-barrel.mjs decorations
```

#### 11. progress (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs circularprogress learningprogress stageprogress stepprogress timelineprogress
node scripts/create-barrel.mjs progress
```

#### 12. dataDisplay

```bash
cd frontend && node scripts/install-paper-ui.mjs dataemptystate descriptionlist timeline treeview
node scripts/create-barrel.mjs dataDisplay
```

#### 13. motion

```bash
cd frontend && node scripts/install-paper-ui.mjs animatedcounter collapse expand fade hovereffect presence scale slide
node scripts/create-barrel.mjs motion
```

#### 14. paper

```bash
cd frontend && node scripts/install-paper-ui.mjs paper papershadow papertexture
node scripts/create-barrel.mjs paper
```

#### 15. advancedForms

```bash
cd frontend && node scripts/install-paper-ui.mjs papercalendar papercolorpicker paperdatepicker paperdaterangepicker paperformsections papertaginput papertimepicker papertokeninput papervalidation
node scripts/create-barrel.mjs advancedForms
```

#### 16. rows (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs conceptrow courserow flashcardrow pluginrow quizrow searchresultrow statrow timelinerow
node scripts/create-barrel.mjs rows
```

#### 17. tables (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs emptytable pagination
node scripts/create-barrel.mjs tables
```

#### 18. stats

```bash
cd frontend && node scripts/install-paper-ui.mjs heatmap insightbox minichart progresssummary statnumber statsgrid
node scripts/create-barrel.mjs stats
```

#### 19. teaching

```bash
cd frontend && node scripts/install-paper-ui.mjs conceptedgelabel conceptnode knowledgegraphnode knowledgenode learningstepcard masteryfiltergroup prerequisitecard quizrecommendation studyrecommendation
node scripts/create-barrel.mjs teaching
```

#### 20. utility (remaining)

```bash
cd frontend && node scripts/install-paper-ui.mjs avatar divider iconwrapper keyboardhint separator
node scripts/create-barrel.mjs utility
```

#### 21. pdf

```bash
cd frontend && node scripts/install-paper-ui.mjs annotationbubble bookmarkmarker highlightlabel marginnote pagemarker readingprogress selectiontoolbar stickyanchor
node scripts/create-barrel.mjs pdf
```

#### 22. doodles

```bash
node scripts/create-barrel.mjs doodles
```

---

### Task 23: Final verification

**Step 23.1: Verify build**

```bash
cd frontend && npx tsc --noEmit 2>&1 | head -80
```

If there are type errors, fix them (likely incorrect barrel paths or missing type imports).

**Step 23.2: Commit**

```bash
git add frontend/src/paper-ui/
git add frontend/scripts/
git add frontend/components.json
git add .opencode/plans/2026-07-01-paper-ui-install-plan.md
git commit -m "feat: install remaining paper-ui components with barrel exports"
```
