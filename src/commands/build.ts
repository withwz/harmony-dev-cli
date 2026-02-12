import { Command } from 'commander';
import { HvigorBuilder } from '../modules/builder/hvigor.js';

export const buildCommand = new Command('build')
  .description('构建 HarmonyOS 项目')
  .argument('[module]', '模块名称', 'entry')
  .option('--clean', '清理后构建')
  .option('--watch', '监听文件变化自动构建')
  .option('--debug', 'Debug 模式', true)
  .option('--release', 'Release 模式')
  .action(async (module: string, options) => {
    const builder = new HvigorBuilder(process.cwd());
    const mode = options.release ? 'release' : 'debug';

    console.log(`🔨 正在构建模块: ${module}`);

    try {
      await builder.build({
        module,
        clean: options.clean || false,
        watch: options.watch || false,
        mode,
      });
      console.log('✅ 构建成功');
    } catch (error) {
      console.error('❌ 构建失败:', error);
      process.exit(1);
    }
  });
