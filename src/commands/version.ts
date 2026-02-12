import { Command } from 'commander';

export const versionCommand = new Command('version')
  .description('显示版本信息')
  .action(() => {
    console.log('HarmonyOS Dev CLI v0.1.0');
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}/${process.arch}`);
  });
