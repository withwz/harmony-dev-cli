import { Command } from 'commander';
import { AbilityLauncher } from '../modules/launcher/ability.js';

export const launchCommand = new Command('launch')
  .description('启动/停止/重启应用')
  .argument('<bundle-name>', '应用包名')
  .option('--restart', '重启应用')
  .option('--stop', '停止应用')
  .option('--ability <name>', '指定 Ability 名称')
  .action(async (bundleName: string, options) => {
    const launcher = new AbilityLauncher();

    try {
      if (options.stop) {
        console.log(`🛑 正在停止应用: ${bundleName}`);
        await launcher.stop({ bundleName });
        console.log('✅ 应用已停止');
      } else if (options.restart) {
        console.log(`🔄 正在重启应用: ${bundleName}`);
        await launcher.restart({ bundleName, abilityName: options.ability });
        console.log('✅ 应用已重启');
      } else {
        console.log(`🚀 正在启动应用: ${bundleName}`);
        await launcher.launch({
          bundleName,
          abilityName: options.ability,
          restart: false,
          stop: false,
        });
        console.log('✅ 应用已启动');
      }
    } catch (error) {
      console.error('❌ 操作失败:', error);
      process.exit(1);
    }
  });
