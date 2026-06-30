#!/usr/bin/env node
import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { remove } from './commands/remove.js';
import { doctor } from './commands/doctor.js';

const program = new Command();

program
  .name('paper-ui')
  .description('CLI to add Paper UI components to your project')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize your project and install dependencies')
  .action(init);

program
  .command('add')
  .description('Add component(s) to your project')
  .argument('[components...]', 'Component(s) to add')
  .action((components: string[]) => add(...(components ?? [])));

program
  .command('remove')
  .description('Remove a component from your project')
  .argument('[component]', 'The component to remove')
  .action(remove);

program
  .command('doctor')
  .description('Check project health and setup')
  .action(doctor);

program.parse();
