import prompts from 'prompts';
import ora from 'ora';
import chalk from 'chalk';

export async function remove(component?: string) {
  if (!component) {
    const response = await prompts({
      type: 'text',
      name: 'component',
      message: 'Which component would you like to remove?',
    });
    component = response.component;
  }

  if (!component) {
    console.log(chalk.red('No component selected.'));
    return;
  }

  const spinner = ora(`Removing ${component}...`).start();

  try {
    // In a real CLI, this would delete the component file and remove from a local tracking file
    setTimeout(() => {
      spinner.succeed(`Component ${component} removed successfully!`);
    }, 1000);
  } catch (error: any) {
    spinner.fail(`Failed to remove component`);
    console.error(chalk.red(error.message));
  }
}
