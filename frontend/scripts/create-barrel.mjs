#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CWD = path.resolve(__dirname, "..");
const CATEGORY = process.argv[2];
if (!CATEGORY) { console.error("Usage: node create-barrel.mjs <category>"); process.exit(1); }

const srcBarrel = path.resolve(CWD, "../paper-ui/src/components", CATEGORY, "index.ts");
const destBarrel = path.resolve(CWD, "src/paper-ui/components", CATEGORY, "index.ts");

if (!fs.existsSync(srcBarrel)) { console.error(`No source barrel for category "${CATEGORY}"`); process.exit(1); }

let content = fs.readFileSync(srcBarrel, "utf8");
content = content.replace(/from\s+"@paper-ui\/core"/g, 'from "@/paper-ui/core"');
content = content.replace(/from\s+"@paper-ui\/utils"/g, 'from "@/paper-ui/utils"');

fs.mkdirSync(path.dirname(destBarrel), { recursive: true });
fs.writeFileSync(destBarrel, content);
console.log(`Created barrel: ${destBarrel}`);
