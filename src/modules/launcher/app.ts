import { execa } from 'execa';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

interface StartOptions {
  bundleName?: string;
  abilityName?: string;
  moduleName?: string;
}

/**
 * AppLauncher - 应用启动器
 */
export class AppLauncher {
  private workDir: string;

  constructor(workDir: string) {
    this.workDir = workDir;
  }

  /**
   * 启动应用
   */
  async start(options: StartOptions): Promise<void> {
    const config = await this.getAppConfig(options);

    const args = this.buildArgs(config);

    console.log(`🚀 正在启动应用...`);
    console.log(`   包名: ${config.bundleName}`);
    console.log(`   Ability: ${config.abilityName}`);
    console.log(`   模块: ${config.moduleName}\n`);

    try {
      const result = await execa('hdc', ['shell', 'aa', ...args], {
        timeout: 10000,
      });

      // 检查是否成功
      const output = result.stdout || result.stderr || '';
      if (output.includes('error') || output.includes('failed')) {
        console.error(`❌ 启动失败: ${output}`);
        throw new Error(`启动失败: ${output}`);
      }

      console.log('✅ 应用已启动\n');
    } catch (error: any) {
      const output = error.stderr || error.stdout || error.message;
      console.error(`❌ 启动失败: ${output}`);
      throw error;
    }
  }

  /**
   * 构建命令参数
   */
  private buildArgs(config: {
    bundleName: string;
    abilityName: string;
    moduleName: string;
  }): string[] {
    return [
      'start',
      '-a', config.abilityName,
      '-b', config.bundleName,
      '-m', config.moduleName,
    ];
  }

  /**
   * 获取应用配置
   */
  private async getAppConfig(options: StartOptions): Promise<{
    bundleName: string;
    abilityName: string;
    moduleName: string;
  }> {
    // 如果用户指定了包名，直接使用
    if (options.bundleName) {
      return {
        bundleName: options.bundleName,
        abilityName: options.abilityName || 'EntryAbility',
        moduleName: options.moduleName || 'entry',
      };
    }

    // 自动从项目配置读取
    const bundleName = await this.getBundleName();
    const abilityName = await this.getAbilityName();
    const moduleName = options.moduleName || 'entry';

    return {
      bundleName,
      abilityName,
      moduleName,
    };
  }

  /**
   * 获取包名
   */
  private async getBundleName(): Promise<string> {
    const appJsonPath = join(this.workDir, 'AppScope/app.json5');

    if (!existsSync(appJsonPath)) {
      throw new Error('未找到 AppScope/app.json5，请确认在 HarmonyOS 项目目录');
    }

    const content = await readFile(appJsonPath, 'utf-8');
    const match = content.match(/"bundleName"\s*:\s*"([^"]+)"/);

    if (!match) {
      throw new Error('无法从 AppScope/app.json5 中解析 bundleName');
    }

    return match[1];
  }

  /**
   * 获取 Ability 名称
   */
  private async getAbilityName(): Promise<string> {
    const abilityDirs = [
      join(this.workDir, 'entry/src/main/ets/entryability'),
      join(this.workDir, 'entry/src/main/ets/ability'),
    ];

    for (const dir of abilityDirs) {
      if (existsSync(dir)) {
        // 读取目录中的 .ets 文件
        const { readdir } = await import('fs/promises');
        const files = await readdir(dir);
        const etsFile = files.find(f => f.endsWith('.ets'));

        if (etsFile) {
          // 文件名去掉 .ets 后缀就是 Ability 名称
          return etsFile.replace('.ets', '');
        }
      }
    }

    // 默认返回 EntryAbility
    return 'EntryAbility';
  }
}
