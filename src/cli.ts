#!/usr/bin/env node

import { Command } from 'commander';
import { buildCommand } from './commands/build.js';
import { installCommand } from './commands/install.js';
import { launchCommand } from './commands/launch.js';
import { logCommand } from './commands/log.js';
import { deviceCommand } from './commands/device.js';
import { workflowCommand } from './commands/workflow.js';

const program = new Command();

program
  .name('hdc')
  .description('HarmonyOS Dev CLI - 独立于 DevEco Studio 的开发工具')
  .version('0.1.0')
  .option('--json', '以 JSON 格式输出')
  .option('-v, --verbose', '显示详细输出');

// 注册子命令
program.addCommand(buildCommand);
program.addCommand(installCommand);
program.addCommand(launchCommand);
program.addCommand(logCommand);
program.addCommand(deviceCommand);
program.addCommand(workflowCommand);

program.parse();
