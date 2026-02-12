import { Command } from 'commander';
import { DeviceManager } from '../modules/device/manager.js';

export const deviceCommand = new Command('device')
  .description('设备管理');

deviceCommand
  .command('list')
  .description('列出所有连接的设备')
  .action(async () => {
    const manager = new DeviceManager();
    try {
      const devices = await manager.list();
      if (devices.length === 0) {
        console.log('⚠️  未发现连接的设备');
        return;
      }
      console.log('📱 已连接的设备:');
      devices.forEach((device, index) => {
        console.log(`  ${index + 1}. ${device.id} - ${device.name} (${device.state})`);
      });
    } catch (error) {
      console.error('❌ 获取设备列表失败:', error);
      process.exit(1);
    }
  });

deviceCommand
  .command('select')
  .description('选择默认设备')
  .argument('<device-id>', '设备 ID')
  .action(async (deviceId: string) => {
    const manager = new DeviceManager();
    try {
      await manager.select(deviceId);
      console.log(`✅ 已选择设备: ${deviceId}`);
    } catch (error) {
      console.error('❌ 选择设备失败:', error);
      process.exit(1);
    }
  });

deviceCommand
  .command('info')
  .description('显示当前设备信息')
  .action(async () => {
    const manager = new DeviceManager();
    try {
      const info = await manager.getInfo();
      if (info) {
        console.log('📱 当前设备信息:');
        console.log(`  ID: ${info.id}`);
        console.log(`  名称: ${info.name}`);
        console.log(`  状态: ${info.state}`);
        console.log(`  类型: ${info.type}`);
      } else {
        console.log('⚠️  未选择设备');
      }
    } catch (error) {
      console.error('❌ 获取设备信息失败:', error);
      process.exit(1);
    }
  });

deviceCommand
  .command('shell')
  .description('进入设备 shell')
  .action(async () => {
    const manager = new DeviceManager();
    try {
      await manager.shell();
    } catch (error) {
      console.error('❌ 进入 shell 失败:', error);
      process.exit(1);
    }
  });
