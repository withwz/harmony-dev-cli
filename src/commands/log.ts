import { Command } from 'commander';
import { HiLogReader } from '../modules/logger/hilog.js';

export const logCommand = new Command('log')
  .description('查看应用日志')
  .option('-f, --follow', '实时跟踪日志')
  .option('--filter <pattern>', '过滤日志')
  .option('--clear', '清空日志缓冲区')
  .option('-l, --level <level>', '只显示指定级别的日志 (E/W/I/D)')
  .action(async (options) => {
    const reader = new HiLogReader();

    try {
      if (options.clear) {
        await reader.read({ clear: true });
        return;
      }

      if (options.follow) {
        // 实时跟踪会一直运行，直到用户 Ctrl+C
        const proc = reader.follow({
          filter: options.filter,
          level: options.level,
        });

        // 等待进程结束
        await proc;
      } else {
        // 只读取一次日志
        await reader.read({
          filter: options.filter,
          level: options.level,
        });
      }
    } catch (error) {
      process.exit(1);
    }
  });
