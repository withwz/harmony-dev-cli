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

    console.log(`执行: ${hvigorw} ${args.join(' ')}\n`);

    try {
      const result = await execa(hvigorw, args, {
        cwd: this.workDir,
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // 检查退出码
      if (result.exitCode !== 0) {
        const output = result.stderr || result.stdout || '';
        if (output.trim()) {
          this.parseBuildError(output);
        }
        throw new Error(`构建失败，退出码: ${result.exitCode}`);
      }
    } catch (error: any) {
      // 解析错误输出
      const output = error.stderr || error.stdout || '';
      if (output) {
        this.parseBuildError(output);
      }
      throw error;
    }
  }

  /**
   * 查找 hvigorw 脚本
   */
  private findHvigorw(): string | null {
    // 1. 优先使用全局 PATH 中的 hvigorw
    // 直接返回 'hvigorw'，让系统 PATH 去查找
    // 如果不存在，execa 会报错，我们捕获后尝试项目目录

    // 2. 查找项目目录中的 hvigorw
    const candidates = [
      join(this.workDir, 'hvigorw'),
      join(this.workDir, 'hvigorw.bat'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    // 3. 使用全局 hvigorw
    return 'hvigorw';
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
  private parseBuildError(output: string): void {
    this.extractErrors(output);
  }

  /**
   * 提取错误信息
   */
  private extractErrors(output: string): void {
    // 移除 ANSI 颜色代码
    const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '');
    const lines = cleanOutput.split('\n');

    // 先匹配 Hvigor 版本错误
    for (const line of lines) {
      const versionErrorMatch = line.match(/Unsupported modelVersion of Hvigor ([\d.]+)/);
      if (versionErrorMatch) {
        console.error('\n❌ 构建失败');
        console.error(`   当前版本: ${versionErrorMatch[1]}`);
        // 查找支持的版本
        for (const l of lines) {
          const supportedMatch = l.match(/supported Hvigor modelVersion is ([\d.]+)/);
          if (supportedMatch) {
            console.error(`   支持版本: ${supportedMatch[1]}`);
            console.error(`   建议: 检查 hvigor/hvigor-config.json5 中的 modelVersion`);
            break;
          }
        }
        return;
      }

      // 匹配配置错误
      const configErrorMatch = line.match(/Error Message:\s*(.+)/i);
      if (configErrorMatch) {
        console.error(`   错误: ${configErrorMatch[1].trim()}`);
        continue;
      }

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
