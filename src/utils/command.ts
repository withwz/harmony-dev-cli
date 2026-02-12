import { execa, ExecaReturnValue } from 'execa';

/**
 * 命令执行工具
 */
export class CommandRunner {
  /**
   * 执行命令并返回结果
   */
  static async run(
    command: string,
    args: string[],
    options?: { cwd?: string; silent?: boolean }
  ): Promise<ExecaReturnValue> {
    const { stdout, stderr } = await execa(command, args, {
      cwd: options?.cwd,
      stdout: options?.silent ? 'pipe' : 'inherit',
      stderr: options?.silent ? 'pipe' : 'inherit',
    });

    return { stdout, stderr } as ExecaReturnValue;
  }

  /**
   * 检查命令是否存在
   */
  static async exists(command: string): Promise<boolean> {
    try {
      await execa('which', [command]);
      return true;
    } catch {
      return false;
    }
  }
}
