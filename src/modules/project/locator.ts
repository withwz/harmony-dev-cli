import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import type { Project, Module } from '../../types/index.js';

/**
 * Locator 项目定位器
 */
export class Locator {
  /**
   * 检测当前目录是否为 HarmonyOS 项目
   */
  async detect(path: string): Promise<Project | null> {
    // 检查 hvigorw 文件
    const hvigorwPath = join(path, 'hvigorw');
    try {
      await stat(hvigorwPath);
    } catch {
      return null;
    }

    const project: Project = {
      root: path,
      appScope: '',
      modules: [],
    };

    // 检查 AppScope 目录
    const appScopePath = join(path, 'AppScope');
    try {
      const appScopeStat = await stat(appScopePath);
      if (appScopeStat.isDirectory()) {
        project.appScope = appScopePath;
      }
    } catch {
      // AppScope 不存在
    }

    // 检查模块
    const entries = await readdir(path);
    for (const entry of entries) {
      const modulePath = join(path, entry);
      try {
        const entryStat = await stat(modulePath);
        if (entryStat.isDirectory() && await this.isModule(modulePath)) {
          project.modules.push({
            name: entry,
            path: modulePath,
            hapOutput: join(modulePath, 'build/default/outputs/default'),
            default: entry === 'entry',
          });
        }
      } catch {
        // 跳过无法访问的目录
      }
    }

    return project;
  }

  /**
   * 检查目录是否为有效模块
   */
  private async isModule(path: string): Promise<boolean> {
    const buildProfile = join(path, 'build-profile.json5');
    const srcDir = join(path, 'src');

    try {
      await stat(buildProfile);
      return true;
    } catch {
      try {
        const srcStat = await stat(srcDir);
        return srcStat.isDirectory();
      } catch {
        return false;
      }
    }
  }

  /**
   * 从当前目录向上查找项目根目录
   */
  async find(startPath: string): Promise<string | null> {
    let currentPath = startPath;

    while (true) {
      if (await this.isProjectRoot(currentPath)) {
        return currentPath;
      }

      const parentPath = dirname(currentPath);
      if (parentPath === currentPath) {
        return null;
      }
      currentPath = parentPath;
    }
  }

  /**
   * 检查目录是否为项目根目录
   */
  private async isProjectRoot(path: string): Promise<boolean> {
    const hvigorwPath = join(path, 'hvigorw');
    const appScopePath = join(path, 'AppScope');

    try {
      await stat(hvigorwPath);
      await stat(appScopePath);
      return true;
    } catch {
      return false;
    }
  }
}
