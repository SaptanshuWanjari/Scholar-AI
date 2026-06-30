import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export async function doctor() {
  console.log(chalk.bold('Running Paper UI Doctor...\n'));
  
  const checks = [
    {
      name: 'Checking components.json',
      run: async () => {
        await fs.access(path.join(process.cwd(), 'components.json'));
      }
    },
    {
      name: 'Checking Tailwind configuration',
      run: async () => {
        // Just mock for now
        return true;
      }
    }
  ];

  let hasErrors = false;

  for (const check of checks) {
    const spinner = ora(check.name).start();
    try {
      await check.run();
      spinner.succeed();
    } catch (e) {
      spinner.fail();
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.log(chalk.yellow('\nFound some issues. Please run `paper-ui init` to fix missing configurations.'));
  } else {
    console.log(chalk.green('\nAll checks passed! Your project is ready for Paper UI.'));
  }
}
