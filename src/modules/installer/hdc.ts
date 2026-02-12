import { execa } from 'execa';
import type { InstallOptions } from '../../types/index.js';

/**
 * HDCInstaller 封装 hdc install 命令
 */
export class HDCInstaller {
  private hdcPath: string = 'hdc';

  /**
   * 安装 HAP 文件
   */
  async install(options: InstallOptions): Promise<void> {
    let hapPath = options.hapPath;

    if (!hapPath) {
      // TODO: 自动查找 HAP 文件
      hapPath = 'entry/build/default/outputs/default/entry-default.hap';
    }

    const args = ['install'];

    if (options.force) {
      args.push('-f');
    }

    if (options.replace) {
      args.push('-r');
    }

    args.push(hapPath);

    try {
      const { stdout } = await execa(this.hdcPath, args, {
        stdout: 'inherit',
        stderr: 'inherit',
      });
    } catch (error) {
      throw new Error(`安装失败: ${error}`);
    }
  }
}
