import { execa } from 'execa';
import type { LaunchOptions } from '../../types/index.js';

/**
 * AbilityLauncher 封装应用启动控制
 */
export class AbilityLauncher {
  private hdcPath: string = 'hdc';

  /**
   * 启动应用
   */
  async launch(options: LaunchOptions): Promise<void> {
    const ability = options.abilityName || 'MainAbility';
    const args = [
      'shell',
      'aa',
      'start',
      '-a',
      ability,
      '-b',
      options.bundleName,
    ];

    try {
      await execa(this.hdcPath, args);
    } catch (error) {
      throw new Error(`启动失败: ${error}`);
    }
  }

  /**
   * 停止应用
   */
  async stop(options: { bundleName: string }): Promise<void> {
    const args = [
      'shell',
      'aa',
      'force-stop',
      options.bundleName,
    ];

    try {
      await execa(this.hdcPath, args);
    } catch (error) {
      throw new Error(`停止失败: ${error}`);
    }
  }

  /**
   * 重启应用
   */
  async restart(options: LaunchOptions): Promise<void> {
    await this.stop({ bundleName: options.bundleName });
    // 等待一秒确保应用完全停止
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.launch(options);
  }
}
