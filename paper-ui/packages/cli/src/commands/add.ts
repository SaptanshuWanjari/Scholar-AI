import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

// Note: In a real CLI, this would fetch from a remote URL.
// For now, we'll read from the local registry folder.
const REGISTRY_URL = 'http://localhost:3000/registry';
const LOCAL_REGISTRY = path.join(process.cwd(), '../../registry');

export async function add(component?: string) {
  if (!component) {
    const response = await prompts({
      type: 'text',
      name: 'component',
      message: 'Which component would you like to add?',
    });
    component = response.component;
  }

  if (!component) {
    console.log(chalk.red('No component selected.'));
    return;
  }

  const spinner = ora(`Adding ${component}...`).start();

  try {
    // Check if config exists
    let config;
    try {
      const configRaw = await fs.readFile(path.join(process.cwd(), 'components.json'), 'utf8');
      config = JSON.parse(configRaw);
    } catch {
      spinner.fail('components.json not found.');
      console.log(chalk.yellow('Please run `paper-ui init` first.'));
      return;
    }

    // Try to find the component in local registry for this demo
    const componentPath = path.join(LOCAL_REGISTRY, `${component}.json`);
    let componentData;
    try {
      const raw = await fs.readFile(componentPath, 'utf8');
      componentData = JSON.parse(raw);
    } catch {
      spinner.fail(`Component "${component}" not found in registry.`);
      return;
    }

    // Usually we would fetch the raw TSX file and save it
    // For now we just simulate success
    const destDir = path.join(process.cwd(), config.componentsPath, componentData.category || '');
    await fs.mkdir(destDir, { recursive: true });
    
    spinner.succeed(`Component ${component} added successfully!`);
    if (componentData.dependencies && componentData.dependencies.length > 0) {
      console.log(chalk.gray(`\nRemember to install dependencies:`));
      console.log(chalk.cyan(`npm install ${componentData.dependencies.join(' ')}\n`));
    }
  } catch (error: any) {
    spinner.fail(`Failed to add component`);
    console.error(chalk.red(error.message));
  }
}
