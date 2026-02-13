import { existsSync } from 'fs';
import { join } from 'path';
import { execa } from 'execa';

export interface DoctorResult {
  ok: boolean;
  checks: CheckResult[];
}

export interface CheckResult {
  name: string;
  ok: boolean;
  message: string;
  fix?: string;
}

/**
 * 环境检查
 */
export async function doctor(projectPath?: string): Promise<DoctorResult> {
  const checks: CheckResult[] = [];

  // 1. 检查 Node.js
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
  checks.push({
    name: 'Node.js',
    ok: nodeMajor >= 18,
    message: `版本 ${nodeVersion}`,
    fix: nodeMajor < 18 ? '需要 Node.js 18 或更高版本' : undefined,
  });

  // 2. 检查 hvigorw
  const hvigorwOk = await checkCommand('hvigorw');
  checks.push({
    name: 'hvigorw',
    ok: hvigorwOk,
    message: hvigorwOk ? '已安装' : '未找到',
    fix: hvigorwOk ? undefined : '请在 PATH 中安装 hvigorw 或使用项目内的 hvigorw',
  });

  // 3. 检查 hdc
  const hdcOk = await checkCommand('hdc');
  checks.push({
    name: 'hdc',
    ok: hdcOk,
    message: hdcOk ? '已安装' : '未找到',
    fix: hdcOk ? undefined : '请安装 HarmonyOS SDK',
  });

  // 4. 检查设备连接
  if (hdcOk) {
    try {
      const result = await execa('hdc', ['list', 'targets'], { timeout: 5000 });
      const devices = result.stdout.trim();
      checks.push({
        name: '设备连接',
        ok: devices.length > 0,
        message: devices || '无设备连接',
        fix: devices.length > 0 ? undefined : '请连接 HarmonyOS 设备',
      });
    } catch {
      checks.push({
        name: '设备连接',
        ok: false,
        message: '检查失败',
        fix: '确保 hdc 工具正常运行',
      });
    }
  }

  // 5. 检查项目配置
  if (projectPath) {
    const hasHvigorw = existsSync(join(projectPath, 'hvigorw'));
    const hasBuildProfile = existsSync(join(projectPath, 'build-profile.json5'));

    checks.push({
      name: '项目配置',
      ok: hasHvigorw && hasBuildProfile,
      message: hasHvigorw && hasBuildProfile ? '正常' : '缺少配置文件',
      fix: !hasHvigorw ? '需要 hvigorw 脚本' : !hasBuildProfile ? '需要 build-profile.json5' : undefined,
    });
  }

  const allOk = checks.every((c) => c.ok);

  return {
    ok: allOk,
    checks,
  };
}

async function checkCommand(cmd: string): Promise<boolean> {
  try {
    await execa(cmd, ['--version'], { timeout: 5000, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}
