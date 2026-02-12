import { Command } from 'commander';
import { HDCInstaller } from '../modules/installer/hdc.js';

export const installCommand = new Command('install')
  .description('安装 HAP 到设备')
  .argument('[hap-path]', 'HAP 文件路径')
  .option('-f, --force', '强制覆盖安装')
  .option('-r, --replace', '替换现有应用')
  .action(async (hapPath: string | undefined, options) => {
    const installer = new HDCInstaller(process.cwd());

    console.log('📦 正在安装应用...\n');

    try {
      await installer.install({
        hapPath,
        force: options.force || false,
        replace: options.replace || false,
      });
    } catch (error) {
      process.exit(1);
    }
  });
