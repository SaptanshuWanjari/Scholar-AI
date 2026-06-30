import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src/components');
const REGISTRY_DIR = path.join(process.cwd(), 'registry');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function getComponents() {
  const components = [];
  const categories = await fs.readdir(SRC_DIR);

  for (const category of categories) {
    const categoryPath = path.join(SRC_DIR, category);
    const stat = await fs.stat(categoryPath);

    if (stat.isDirectory()) {
      const files = await fs.readdir(categoryPath);
      for (const file of files) {
        if (file.endsWith('.tsx') && !file.startsWith('index')) {
          const name = file.replace('.tsx', '');
          components.push({
            name: name.toLowerCase(),
            category,
            file: path.join('components', category, file),
          });
        }
      }
    }
  }
  return components;
}

async function buildRegistry() {
  await ensureDir(REGISTRY_DIR);
  const components = await getComponents();
  
  for (const comp of components) {
    const data = {
      name: comp.name,
      type: "components:ui",
      dependencies: ["framer-motion", "clsx", "tailwind-merge"],
      registryDependencies: [],
      files: [comp.file]
    };
    await fs.writeFile(
      path.join(REGISTRY_DIR, `${comp.name}.json`),
      JSON.stringify(data, null, 2)
    );
  }
  
  console.log(`Successfully built registry for ${components.length} components.`);
}

buildRegistry().catch(console.error);
