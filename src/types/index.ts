/**
 * 构建选项
 */
export interface BuildOptions {
  module: string;
  clean: boolean;
  watch: boolean;
  mode: 'debug' | 'release';
}

/**
 * 安装选项
 */
export interface InstallOptions {
  hapPath?: string;
  force: boolean;
  replace: boolean;
}

/**
 * 启动选项 (MCP Server 使用)
 */
export interface LaunchOptions {
  bundleName: string;
  abilityName?: string;
  restart: boolean;
  stop: boolean;
}

/**
 * 日志选项
 */
export interface LogOptions {
  follow: boolean;
  filter?: string;
  clear: boolean;
  level?: string;
  since?: string;
  save?: string;
}
