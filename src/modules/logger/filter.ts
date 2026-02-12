import type { LogEntry } from '../../types/index.js';

/**
 * LogFilter 日志过滤器
 */
export class LogFilter {
  private tags: Set<string> = new Set();
  private levels: Set<string> = new Set();

  /**
   * 添加标签过滤
   */
  addTag(tag: string): void {
    this.tags.add(tag);
  }

  /**
   * 添加级别过滤
   */
  addLevel(level: string): void {
    this.levels.add(level);
  }

  /**
   * 检查日志是否匹配过滤条件
   */
  match(entry: LogEntry): boolean {
    if (this.tags.size > 0 && !this.tags.has(entry.tag)) {
      return false;
    }

    if (this.levels.size > 0 && !this.levels.has(entry.level)) {
      return false;
    }

    return true;
  }

  /**
   * 清除所有过滤条件
   */
  clear(): void {
    this.tags.clear();
    this.levels.clear();
  }
}
