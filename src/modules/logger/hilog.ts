import { execa, type ExecaChildProcess } from 'execa';

interface LogOptions {
  follow?: boolean;
  filter?: string;
  level?: string;
  clear?: boolean;
}

/**
 * HiLogReader - 封装 hilog 日志读取
 */
export class HiLogReader {
  /**
   * 读取日志
   */
  async read(options: LogOptions): Promise<void> {
    if (options.clear) {
      await this.clearLogs();
      console.log('✅ 日志缓冲区已清空\n');
      return;
    }

    const args = this.buildArgs(options);

    try {
      await execa('hdc', ['shell', 'hilog', ...args], {
        stdout: 'inherit',
        stderr: 'inherit',
      });
    } catch (error) {
      console.error('❌ 读取日志失败');
      throw error;
    }
  }

  /**
   * 实时跟踪日志
   */
  follow(options: LogOptions): ExecaChildProcess {
    const args = this.buildArgs(options);
    args.push('-T'); // 实时模式

    console.log('📋 正在实时跟踪日志 (Ctrl+C 退出)...\n');

    return execa('hdc', ['shell', 'hilog', ...args], {
      stdout: 'inherit',
      stderr: 'inherit',
    });
  }

  /**
   * 清空日志缓冲区
   */
  private async clearLogs(): Promise<void> {
    await execa('hdc', ['shell', 'hilog', '-r']);
  }

  /**
   * 构建命令参数
   */
  private buildArgs(options: LogOptions): string[] {
    const args: string[] = [];

    if (options.level) {
      args.push('-L', options.level);
    }

    if (options.filter) {
      // 使用 grep 过滤
      // 注意：这会在 shell 中执行，需要转义
    }

    return args;
  }
}
