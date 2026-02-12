import { Command } from 'commander';
import { HDCInstaller } from '../modules/installer/hdc.js';

export const installCommand = new Command('install')
  .description('安装 HAP 到设备')
  .argument('[hap-path]', 'HAP 文件路径')
  .option('-f, --force', '覆盖安装')
  .option('-r, --replace', '替换现有应用')
  .action(async (hapPath: string | undefined, options) => {
    const installer = new HDCInstaller();

    console.log('📦 正在安装应用...');

    try {
      await installer.install({
        hapPath,
        force: options.force || false,
        replace: options.replace || false,
      });
      console.log('✅ 安装成功');
    } catch (error) {
      console.error('❌ 安装失败:', error);
      process.exit(1);
    }
  });
