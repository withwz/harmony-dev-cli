/**
 * DeviceManager 集成测试
 *
 * 集成测试：测试模块间的协作
 * 需要模拟 hdc 命令的输出
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeviceManager } from './manager.js';

// Mock execa
vi.mock('execa', () => ({
  execa: vi.fn(),
}));

import { execa } from 'execa';

describe('DeviceManager (集成测试)', () => {
  let manager: DeviceManager;

  beforeEach(() => {
    manager = new DeviceManager();
    vi.clearAllMocks();
  });

  describe('list()', () => {
    it('应该解析 hdc list targets 的输出', async () => {
      // Mock hdc 命令输出
      vi.mocked(execa).mockResolvedValue({
        stdout: '192.168.1.100:5555\n192.168.1.101:5555',
        stderr: '',
        command: 'hdc',
        escapedCommand: '',
        exitCode: 0,
        failed: false,
        isCanceled: false,
        killed: false,
        stdout: '192.168.1.100:5555\n192.168.1.101:5555',
        stderr: '',
      });

      const devices = await manager.list();

      expect(devices).toHaveLength(2);
      expect(devices[0].id).toBe('192.168.1.100:5555');
      expect(devices[1].id).toBe('192.168.1.101:5555');
    });

    it('没有设备时应该返回空数组', async () => {
      vi.mocked(execa).mockResolvedValue({
        stdout: '[Empty]',
        stderr: '',
        command: 'hdc',
        escapedCommand: '',
        exitCode: 0,
        failed: false,
        isCanceled: false,
        killed: false,
        stdout: '[Empty]',
        stderr: '',
      });

      const devices = await manager.list();

      expect(devices).toEqual([]);
    });
  });

  describe('select()', () => {
    it('应该选择指定的设备', async () => {
      vi.mocked(execa).mockResolvedValue({
        stdout: '192.168.1.100:5555',
        stderr: '',
        command: 'hdc',
        escapedCommand: '',
        exitCode: 0,
        failed: false,
        isCanceled: false,
        killed: false,
        stdout: '192.168.1.100:5555',
        stderr: '',
      });

      await manager.select('192.168.1.100:5555');

      expect(manager.getCurrent()).toBe('192.168.1.100:5555');
    });

    it('设备不存在时应该抛出错误', async () => {
      vi.mocked(execa).mockResolvedValue({
        stdout: '192.168.1.100:5555',
        stderr: '',
        command: 'hdc',
        escapedCommand: '',
        exitCode: 0,
        failed: false,
        isCanceled: false,
        killed: false,
        stdout: '192.168.1.100:5555',
        stderr: '',
      });

      await expect(manager.select('192.168.1.101:5555')).rejects.toThrow(
        '设备 192.168.1.101:5555 不存在'
      );
    });
  });
});
