import type { LogEntry } from '../../types/index.js';

/**
 * 日志级别颜色映射
 */
const LEVEL_COLORS: Record<string, string> = {
  E: '\x1b[31m', // 红色
  W: '\x1b[33m', // 黄色
  I: '\x1b[32m', // 绿色
  D: '\x1b[36m', // 青色
};

const RESET = '\x1b[0m';

/**
 * LogFormatter 日志格式化器
 */
export class LogFormatter {
  private useColor: boolean;
  private useJSON: boolean;

  constructor(useColor: boolean = true, useJSON: boolean = false) {
    this.useColor = useColor;
    this.useJSON = useJSON;
  }

  /**
   * 格式化日志条目
   */
  format(entry: LogEntry): string {
    if (this.useJSON) {
      return this.formatJSON(entry);
    }
    return this.formatText(entry);
  }

  /**
   * 文本格式输出
   */
  private formatText(entry: LogEntry): string {
    const color = this.useColor && LEVEL_COLORS[entry.level]
      ? LEVEL_COLORS[entry.level]
      : '';

    return `${color}[${entry.level}]${RESET} ${entry.tag}: ${entry.message}`;
  }

  /**
   * JSON 格式输出
   */
  private formatJSON(entry: LogEntry): string {
    const json = {
      type: 'log',
      level: entry.level,
      tag: entry.tag,
      message: entry.message,
      time: entry.time,
      pid: entry.pid,
      tid: entry.tid,
    };

    return JSON.stringify(json);
  }

  /**
   * 设置颜色输出
   */
  setColor(useColor: boolean): void {
    this.useColor = useColor;
  }

  /**
   * 设置 JSON 输出
   */
  setJSON(useJSON: boolean): void {
    this.useJSON = useJSON;
  }
}
