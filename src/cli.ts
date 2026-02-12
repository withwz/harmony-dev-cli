#!/usr/bin/env node

import { Command } from 'commander';
import { versionCommand } from './commands/version.js';
import { buildCommand } from './commands/build.js';
import { installCommand } from './commands/install.js';
import { logCommand } from './commands/log.js';

const program = new Command();

program
  .name('hdc')
  .description('HarmonyOS Dev CLI - 构建和调试工具')
  .version('0.1.0')
  .addCommand(versionCommand)
  .addCommand(buildCommand)
  .addCommand(installCommand)
  .addCommand(logCommand);

program.parse();
