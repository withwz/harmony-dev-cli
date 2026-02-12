import { execa, ExecaChildProcess } from 'execa';
import type { LogEntry } from '../../types/index.js';

/**
 * HiLogReader 封装 hilog 日志读取
 */
export class HiLogReader {
  private hdcPath: string = 'hdc';

  /**
   * 读取日志
   */
  async read(options: {
    filter?: string;
    level?: string;
    since?: string;
    save?: string;
  }): Promise<void> {
    const args = this.buildArgs(options);

    try {
      const { stdout } = await execa(this.hdcPath, args);
      console.log(stdout);
    } catch (error) {
      throw new Error(`读取日志失败: ${error}`);
    }
  }

  /**
   * 实时跟踪日志
   */
  async follow(options: {
    filter?: string;
    level?: string;
    since?: string;
  }): Promise<void> {
    const args = ['shell', 'hilog'];

    if (options.level) {
      args.push('-L', options.level);
    }

    if (options.filter) {
      args.push('|', 'grep', options.filter);
    }

    try {
      const proc = execa(this.hdcPath, ['shell', 'hilog'], {
        stdout: 'inherit',
        stderr: 'inherit',
      });

      await proc;
    } catch (error) {
      throw new Error(`跟踪日志失败: ${error}`);
    }
  }

  /**
   * 清空日志缓冲区
   */
  async clear(): Promise<void> {
    try {
      await execa(this.hdcPath, ['shell', 'hilog', '-r']);
    } catch (error) {
      throw new Error(`清空日志失败: ${error}`);
    }
  }

  /**
   * 构建命令行参数
   */
  private buildArgs(options: {
    filter?: string;
    level?: string;
    since?: string;
  }): string[] {
    const args: string[] = ['shell', 'hilog'];

    if (options.level) {
      args.push('-L', options.level);
    }

    if (options.since) {
      args.push('-T', options.since);
    }

    return args;
  }

  /**
   * 解析日志行
   */
  parseLogLine(line: string): LogEntry | null {
    // TODO: 实现 hilog 格式解析
    return null;
  }

  /**
   * 格式化日志输出
   */
  formatLogEntry(entry: LogEntry, useColor: boolean = true): string {
    const colors = {
      E: '\x1b[31m', // 红色
      W: '\x1b[33m', // 黄色
      I: '\x1b[32m', // 绿色
      D: '\x1b[36m', // 青色
    };

    const reset = '\x1b[0m';
    const color = useColor && entry.level in colors ? colors[entry.level as keyof typeof colors] : '';

    return `${color}[${entry.level}]${reset} ${entry.tag}: ${entry.message}`;
  }
}
