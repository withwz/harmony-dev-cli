import { execa } from 'execa';
import { existsSync } from 'fs';
import { join } from 'path';

interface InstallOptions {
  hapPath?: string;
  force: boolean;
  replace: boolean;
}

/**
 * HDCInstaller - 封装 hdc install 命令
 */
export class HDCInstaller {
  private workDir: string;

  constructor(workDir: string) {
    this.workDir = workDir;
  }

  /**
   * 安装 HAP 文件
   */
  async install(options: InstallOptions): Promise<void> {
    let hapPath = options.hapPath;

    if (!hapPath) {
      hapPath = this.findHapFile();
    }

    if (!hapPath) {
      throw new Error('未找到 HAP 文件，请先构建项目');
    }

    const args = ['install'];

    if (options.force) {
      args.push('-f');
    }

    if (options.replace) {
      args.push('-r');
    }

    args.push(hapPath);

    console.log(`执行: hdc ${args.join(' ')}`);

    try {
      const result = await execa('hdc', args, {
        stdout: 'pipe',
        stderr: 'pipe',
      });

      // 打印输出
      if (result.stdout) {
        console.log(result.stdout);
      }
      if (result.stderr) {
        console.error(result.stderr);
      }

      // 检查退出码
      if (result.exitCode !== 0) {
        throw new Error(`安装失败，退出码: ${result.exitCode}`);
      }

      console.log('\n✅ 安装成功');
    } catch (error: any) {
      console.error('\n❌ 安装失败');
      if (error.stderr) {
        console.error(error.stderr);
      }
      throw error;
    }
  }

  /**
   * 查找 HAP 文件
   */
  private findHapFile(): string | null {
    const candidates = [
      // Debug 模式 - unsigned
      join(this.workDir, 'entry/build/default/outputs/default/entry-default-unsigned.hap'),
      // Debug 模式 - signed
      join(this.workDir, 'entry/build/default/outputs/default/entry-default.hap'),
      join(this.workDir, 'entry/build/default/outputs/default/entry-signed.hap'),
      // Release 模式
      join(this.workDir, 'entry/build/release/outputs/default/entry-release.hap'),
      join(this.workDir, 'entry/build/release/outputs/default/entry-signed-release.hap'),
    ];

    for (const candidate of candidates) {
      if (existsSync(candidate)) {
        return candidate;
      }
    }

    return null;
  }
}
