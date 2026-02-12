import { execa } from 'execa';
import type { Device } from '../../types/index.js';

/**
 * DeviceManager 设备管理器
 */
export class DeviceManager {
  private hdcPath: string = 'hdc';
  private currentDevice: string | null = null;

  /**
   * 列出所有设备
   */
  async list(): Promise<Device[]> {
    try {
      const { stdout } = await execa(this.hdcPath, ['list', 'targets']);

      if (!stdout || stdout.trim() === '[Empty]') {
        return [];
      }

      const lines = stdout.trim().split('\n');
      const devices: Device[] = [];

      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 2) {
          devices.push({
            id: parts[0],
            name: parts[1] || 'Unknown',
            state: parts[parts.length - 1] || 'unknown',
            type: 'harmonyos',
            online: true,
          });
        }
      }

      return devices;
    } catch (error) {
      throw new Error(`获取设备列表失败: ${error}`);
    }
  }

  /**
   * 选择默认设备
   */
  async select(deviceId: string): Promise<void> {
    const devices = await this.list();
    const exists = devices.some(d => d.id === deviceId);

    if (!exists) {
      throw new Error(`设备 ${deviceId} 不存在`);
    }

    this.currentDevice = deviceId;
  }

  /**
   * 获取当前选择的设备
   */
  getCurrent(): string | null {
    return this.currentDevice;
  }

  /**
   * 获取设备信息
   */
  async getInfo(deviceId?: string): Promise<Device | null> {
    const targetId = deviceId || this.currentDevice;

    if (!targetId) {
      const devices = await this.list();
      if (devices.length > 0) {
        return devices[0];
      }
      return null;
    }

    const devices = await this.list();
    return devices.find(d => d.id === targetId) || null;
  }

  /**
   * 进入设备 shell
   */
  async shell(): Promise<void> {
    const deviceId = this.currentDevice;

    try {
      if (deviceId) {
        await execa(this.hdcPath, ['-t', deviceId, 'shell'], {
          stdout: 'inherit',
          stderr: 'inherit',
          stdin: 'inherit',
        });
      } else {
        await execa(this.hdcPath, ['shell'], {
          stdout: 'inherit',
          stderr: 'inherit',
          stdin: 'inherit',
        });
      }
    } catch (error) {
      throw new Error(`进入 shell 失败: ${error}`);
    }
  }
}
