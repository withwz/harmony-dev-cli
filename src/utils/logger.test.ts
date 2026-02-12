/**
 * Logger 单元测试
 *
 * TDD 流程：
 * 1. 🔴 先写测试（测试会失败）
 * 2. 🟢 写最少代码让测试通过
 * 3. 🔄 重构优化代码
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Logger } from './logger.js';

describe('Logger', () => {
  let consoleInfoSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('info()', () => {
    it('应该输出 INFO 级别的日志', () => {
      const logger = new Logger();
      logger.info('测试消息');

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] 测试消息');
    });

    it('应该支持多个参数', () => {
      const logger = new Logger();
      logger.info('测试消息', { foo: 'bar' }, 123);

      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] 测试消息', { foo: 'bar' }, 123);
    });
  });

  describe('error()', () => {
    it('应该输出 ERROR 级别的日志', () => {
      const logger = new Logger();
      logger.error('错误消息');

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] 错误消息');
    });
  });

  describe('warn()', () => {
    it('应该输出 WARN 级别的日志', () => {
      const logger = new Logger();
      logger.warn('警告消息');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] 警告消息');
    });
  });

  describe('debug()', () => {
    it('verbose=false 时应该不输出 debug 日志', () => {
      const logger = new Logger(false);
      logger.debug('调试消息');

      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('verbose=true 时应该输出 debug 日志', () => {
      const logger = new Logger(true);
      logger.debug('调试消息');

      expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] 调试消息');
    });
  });

  describe('success()', () => {
    it('应该输出 SUCCESS 级别的日志', () => {
      const logger = new Logger();
      logger.success('成功消息');

      expect(consoleInfoSpy).toHaveBeenCalledWith('[SUCCESS] 成功消息');
    });
  });
});
