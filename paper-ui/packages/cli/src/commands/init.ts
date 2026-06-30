import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';

export async function init() {
  console.log(chalk.bold('Initializing Paper UI...\n'));

  const response = await prompts([
    {
      type: 'text',
      name: 'componentsPath',
      message: 'Where would you like to install components?',
      initial: 'src/components',
    },
    {
      type: 'text',
      name: 'utilsPath',
      message: 'Where would you like to install utilities?',
      initial: 'src/utils',
    }
  ]);

  if (!response.componentsPath || !response.utilsPath) {
    console.log(chalk.red('\nInitialization cancelled.'));
    return;
  }

  const spinner = ora('Writing components.json...').start();
  
  const config = {
    componentsPath: response.componentsPath,
    utilsPath: response.utilsPath,
  };

  try {
    await fs.writeFile(
      path.join(process.cwd(), 'components.json'),
      JSON.stringify(config, null, 2)
    );
    spinner.succeed('Configuration saved to components.json');
    console.log(chalk.green('\nProject initialized successfully.'));
    console.log(`Run ${chalk.cyan('paper-ui add <component>')} to start adding components.`);
  } catch (error: any) {
    spinner.fail('Failed to write configuration');
    console.error(chalk.red(error.message));
  }
}
