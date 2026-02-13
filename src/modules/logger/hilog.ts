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

    const cmd = this.buildCommand(options);

    try {
      await execa(cmd.command, cmd.args, {
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
    const cmd = this.buildCommand(options);

    console.log('📋 正在实时跟踪日志 (Ctrl+C 退出)...\n');
    if (options.filter) {
      console.log(`   过滤: ${options.filter}\n`);
    }

    return execa(cmd.command, cmd.args, {
      stdout: 'inherit',
      stderr: 'inherit',
    });
  }

  /**
   * 构建完整命令
   */
  private buildCommand(options: LogOptions): { command: string; args: string[] } {
    const args = this.buildArgs(options);

    // 如果有过滤，使用管道 + grep
    if (options.filter) {
      return {
        command: 'sh',
        args: ['-c', `hdc shell hilog ${args.join(' ')} | grep -i "${options.filter}"`],
      };
    }

    return {
      command: 'hdc',
      args: ['shell', 'hilog', ...args],
    };
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

    // 默认只显示 I/W/E 级别，过滤掉 D 级别
    const level = options.level || 'I';
    args.push('-L', level);

    return args;
  }
}
