import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import type { AppConfig, Module, ProjectConfig, DeviceConfig, BuildConfig, LogConfig } from '../../types/index.js';

/**
 * 默认配置
 */
const defaultConfig: AppConfig = {
  project: {
    root: '.',
    modules: [{ name: 'entry', default: true }],
    hapOutput: 'entry/build/default/outputs/default',
  },
  device: {
    default: 'auto',
    timeout: '30s',
  },
  build: {
    hvigorw: './hvigorw',
    mode: 'debug',
  },
  log: {
    level: 'I',
    filters: [],
    color: true,
  },
};

/**
 * ConfigManager 配置管理器
 */
export class ConfigManager {
  private configPath: string;
  private config: AppConfig;

  constructor(configPath?: string) {
    this.configPath = configPath || join(homedir(), '.hdc', 'config.yaml');
    this.config = defaultConfig;
  }

  /**
   * 加载配置文件
   */
  async load(): Promise<AppConfig> {
    try {
      // TODO: 实现 YAML 解析
      // 目前使用默认配置
      return this.config;
    } catch (error) {
      return defaultConfig;
    }
  }

  /**
   * 保存配置文件
   */
  async save(config: AppConfig): Promise<void> {
    this.config = config;
    // TODO: 实现 YAML 序列化
  }

  /**
   * 获取项目配置
   */
  getProjectConfig(): ProjectConfig {
    return this.config.project;
  }

  /**
   * 获取设备配置
   */
  getDeviceConfig(): DeviceConfig {
    return this.config.device;
  }

  /**
   * 获取构建配置
   */
  getBuildConfig(): BuildConfig {
    return this.config.build;
  }

  /**
   * 获取日志配置
   */
  getLogConfig(): LogConfig {
    return this.config.log;
  }

  /**
   * 获取默认模块
   */
  getDefaultModule(): Module | undefined {
    return this.config.project.modules.find(m => m.default);
  }
}
