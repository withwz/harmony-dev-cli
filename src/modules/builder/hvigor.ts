import { execa } from 'execa';
import { existsSync } from 'fs';
import { join } from 'path';

interface BuildOptions {
  module: string;
  clean: boolean;
  watch: boolean;
  mode: 'debug' | 'release';
}

/**
 * HvigorBuilder - 封装 hvigorw 构建工具
 */
export class HvigorBuilder {
  private workDir: string;

  constructor(workDir: string) {
    this.workDir = workDir;
  }

  /**
   * 执行构建
   */
  async build(options: BuildOptions): Promise<void> {
    const hvigorw = this.findHvigorw();

    if (!hvigorw) {
      throw new Error('未找到 hvigorw，请确认在 HarmonyOS 项目目录');
    }

    const args = this.buildArgs(options);

    console.log(`执行: ${hvigorw} ${args.join(' ')}`);

    try {
      await execa(hvigorw, args, {
        cwd: this.workDir,
        stdout: 'inherit',
        stderr: 'inherit',
      });
    } catch (error) {
      this.parseBuildError(error);
      throw error;
    }
  }

  /**
   * 查找 hvigorw 脚本
   */
  private findHvigorw(): string | null {
    const candidates = [
      join(this.workDir, 'hvigorw'),
      join(this.workDir, 'hvigorw.bat'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * 构建命令参数
   */
  private buildArgs(options: BuildOptions): string[] {
    const args: string[] = [];

    if (options.clean) {
      args.push('--clean', '--no-daemon');
    }

    // assembleHap 或 assembleHapRelease
    const task = options.mode === 'release' ? 'assembleHap' : 'assembleHap';
    args.push(task);

    return args;
  }

  /**
   * 解析构建错误
   */
  private parseBuildError(error: unknown): void {
    const err = error as { stdout?: string; stderr?: string };
    const output = err.stdout || err.stderr || '';

    // 尝试提取错误信息
    this.extractErrors(output);
  }

  /**
   * 提取错误信息
   */
  private extractErrors(output: string): void {
    const lines = output.split('\n');

    for (const line of lines) {
      // 匹配常见错误格式
      // ERROR: file:line: error message
      const errorMatch = line.match(/ERROR:\s*(.+?):(\d+):?\s*(.+)/i);
      if (errorMatch) {
        console.error('\n❌ 构建失败');
        console.error(`   文件: ${errorMatch[1]}`);
        console.error(`   行号: ${errorMatch[2]}`);
        console.error(`   错误: ${errorMatch[3].trim()}`);
        console.error(`   建议: 检查文件第 ${errorMatch[2]} 行`);
        return;
      }

      // 匹配 TypeScript 错误
      // file.ts(line,column): error TS1234: message
      const tsErrorMatch = line.match(/(.+)\((\d+),(\d+)\):\s*error\s+TS\d+:\s*(.+)/i);
      if (tsErrorMatch) {
        console.error('\n❌ 构建失败');
        console.error(`   文件: ${tsErrorMatch[1]}`);
        console.error(`   位置: ${tsErrorMatch[2]}行${tsErrorMatch[3]}列`);
        console.error(`   错误: ${tsErrorMatch[4].trim()}`);
        return;
      }
    }
  }
}
