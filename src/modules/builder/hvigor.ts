import { execa } from 'execa';
import type { BuildOptions } from '../../types/index.js';

/**
 * HvigorBuilder 封装 hvigorw 构建工具
 */
export class HvigorBuilder {
  private hvigorPath: string;
  private workDir: string;

  constructor(workDir: string) {
    this.hvigorPath = './hvigorw';
    this.workDir = workDir;
  }

  /**
   * 执行构建
   */
  async build(options: BuildOptions): Promise<void> {
    const args = this.buildArgs(options);

    try {
      const { stdout } = await execa(this.hvigorPath, args, {
        cwd: this.workDir,
        stdout: 'inherit',
        stderr: 'inherit',
      });

      if (options.watch) {
        // TODO: 实现文件监听
      }
    } catch (error) {
      throw new Error(`构建失败: ${error}`);
    }
  }

  /**
   * 构建命令行参数
   */
  private buildArgs(options: BuildOptions): string[] {
    const args: string[] = [];

    if (options.clean) {
      args.push('--clean', '--no-daemon');
    }

    args.push('assemble' + (options.mode === 'release' ? 'Hap' : 'Hap'));

    return args;
  }

  /**
   * 获取 HAP 输出路径
   */
  getHapPath(module: string, mode: 'debug' | 'release'): string {
    const modeDir = mode === 'release' ? 'release' : 'default';
    return `${this.workDir}/${module}/build/${modeDir}/outputs/default/${module}-${mode}.hap`;
  }
}
