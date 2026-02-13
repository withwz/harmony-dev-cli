import { Command } from 'commander';
import { AppLauncher } from '../modules/launcher/app.js';

export const startCommand = new Command('start')
  .description('启动 HarmonyOS 应用')
  .option('-b, --bundle <name>', '应用包名')
  .option('-a, --ability <name>', 'Ability 名称')
  .option('-m, --module <name>', '模块名')
  .action(async (options) => {
    const launcher = new AppLauncher(process.cwd());

    try {
      await launcher.start({
        bundleName: options.bundle,
        abilityName: options.ability,
        moduleName: options.module,
      });
    } catch (error: any) {
      console.error(error.message);
      process.exit(1);
    }
  });
