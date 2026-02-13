/**
 * 设备信息
 */
export interface Device {
  id: string;
  name: string;
  state: string;
  type: string;
  online: boolean;
}

/**
 * 项目
 */
export interface Project {
  root: string;
  appScope: string;
  modules: Module[];
}

/**
 * 项目配置
 */
export interface ProjectConfig {
  root: string;
  modules: Module[];
  hapOutput: string;
}

/**
 * 模块配置
 */
export interface Module {
  name: string;
  default: boolean;
  path?: string;
  hapOutput?: string;
}

/**
 * 应用配置
 */
export interface AppConfig {
  project: ProjectConfig;
  device: DeviceConfig;
  build: BuildConfig;
  log: LogConfig;
}

/**
 * 设备配置
 */
export interface DeviceConfig {
  default: string;
  timeout: string;
}

/**
 * 构建配置
 */
export interface BuildConfig {
  hvigorw: string;
  mode: 'debug' | 'release';
}

/**
 * 日志配置
 */
export interface LogConfig {
  level: string;
  filters: string[];
  color: boolean;
}

/**
 * 日志条目
 */
export interface LogEntry {
  time: string;
  level: string;
  tag: string;
  pid: number;
  tid: number;
  message: string;
}

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
 * 启动选项
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
