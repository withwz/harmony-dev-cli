import { Command } from 'commander';
import { HiLogReader } from '../modules/logger/hilog.js';

export const logCommand = new Command('log')
  .description('查看应用日志')
  .option('-f, --follow', '实时跟踪日志（类似 tail -f）')
  .option('--filter <pattern>', '过滤日志')
  .option('--clear', '清空日志缓冲区')
  .option('-l, --level <level>', '只显示指定级别的日志 (E/W/I/D)')
  .option('--since <time>', '显示最近时间的日志')
  .option('-o, --save <file>', '保存日志到文件')
  .action(async (options) => {
    const reader = new HiLogReader();

    try {
      if (options.clear) {
        console.log('🧹 正在清空日志缓冲区...');
        await reader.clear();
        console.log('✅ 日志缓冲区已清空');
        return;
      }

      if (options.follow) {
        console.log('📋 正在实时跟踪日志...');
        await reader.follow({
          filter: options.filter,
          level: options.level,
          since: options.since,
        });
      } else {
        console.log('📋 正在读取日志...');
        await reader.read({
          filter: options.filter,
          level: options.level,
          since: options.since,
          save: options.save,
        });
      }
    } catch (error) {
      console.error('❌ 读取日志失败:', error);
      process.exit(1);
    }
  });
