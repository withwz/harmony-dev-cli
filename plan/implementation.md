# 实现计划

## Phase 1: 基础框架 ✅

### 已完成
- [x] 项目初始化
- [x] TypeScript 配置
- [x] CLI 框架搭建 (Commander.js)
- [x] 目录结构设计
- [x] 类型定义
- [x] Git 初始化

---

## Phase 2: 核心命令实现

### 2.1 version 命令 (最简单，从这里开始)
**文件**: `src/commands/version.ts`

```typescript
import { Command } from 'commander';

export const versionCommand = new Command('version')
  .description('显示版本信息')
  .action(() => {
    console.log('HarmonyOS Dev CLI v0.1.0');
    console.log(`Node: ${process.version}`);
    console.log(`Platform: ${process.platform}/${process.arch}`);
  });
```

**验证方式**:
```bash
npm run dev version
```

---

### 2.2 build 命令
**文件**: `src/modules/builder/hvigor.ts`

**核心功能**:
1. 调用 `./hvigorw assembleHap`
2. 解析构建输出
3. 返回构建结果

**实现要点**:
```typescript
// 使用 execa 执行命令
const { stdout } = await execa('./hvigorw', ['assembleHap'], {
  cwd: projectDir,
  stdout: 'inherit',
  stderr: 'inherit'
});
```

**验证方式**:
```bash
# 需要一个 HarmonyOS 项目
cd /path/to/harmony/project
hdc build
```

**HAP 文件位置检测**:
```typescript
// 自动查找 HAP 文件
const hapPaths = [
  'entry/build/default/outputs/default/entry-default.hap',
  'entry/build/release/outputs/default/entry-release.hap'
];
```

---

### 2.3 device 命令
**文件**: `src/modules/device/manager.ts`

**核心功能**:
1. 列出设备 (`hdc list targets`)
2. 选择设备
3. 获取设备信息

**实现要点**:
```typescript
// 解析设备列表输出
const { stdout } = await execa('hdc', ['list', 'targets']);
// 输出格式: "192.168.1.100:5555\n192.168.1.101:5555"
const devices = stdout.trim().split('\n').map(id => ({
  id,
  name: 'Unknown',
  state: 'online'
}));
```

**验证方式**:
```bash
# 需要连接的 HarmonyOS 设备
hdc device list
```

---

### 2.4 install 命令
**文件**: `src/modules/installer/hdc.ts`

**核心功能**:
1. 查找 HAP 文件
2. 调用 `hdc install`

**实现要点**:
```typescript
// 自动查找最新的 HAP 文件
const hapPath = await findLatestHap(projectDir, module);
await execa('hdc', ['install', '-r', hapPath]);
```

**验证方式**:
```bash
hdc install
```

---

### 2.5 launch 命令
**文件**: `src/modules/launcher/ability.ts`

**核心功能**:
1. 启动应用 (`hdc shell aa start`)
2. 停止应用 (`hdc shell aa force-stop`)
3. 重启应用

**实现要点**:
```typescript
// 启动应用
await execa('hdc', ['shell', 'aa', 'start', '-a', ability, '-b', bundleName]);

// 停止应用
await execa('hdc', ['shell', 'aa', 'force-stop', bundleName]);
```

**验证方式**:
```bash
hdc launch com.example.app
hdc launch com.example.app --stop
hdc launch com.example.app --restart
```

---

### 2.6 log 命令
**文件**: `src/modules/logger/hilog.ts`

**核心功能**:
1. 读取日志 (`hdc shell hilog`)
2. 实时跟踪日志
3. 过滤和格式化

**实现要点**:
```typescript
// 实时日志
const proc = execa('hdc', ['shell', 'hilog', '-T']);
proc.stdout?.on('data', (data) => {
  const logLine = data.toString();
  // 解析和格式化
  console.log(formatLog(logLine));
});
```

**日志格式解析**:
```
10-12 15:30:45.123  1234  5678  I  MyApp: Hello World
  ^^^^^^^^^^^^^^^^  ^^^^  ^^^^  ^   ^^^^^ ^^^^^^^^^
  时间               PID   TID   级别 Tag  Message
```

**验证方式**:
```bash
hdc log --follow
hdc log --filter "MyApp"
hdc log --level E
```

---

### 2.7 workflow 命令
**文件**: `src/modules/workflow/runner.ts`

**核心功能**:
1. 串联多个命令
2. 顺序执行
3. 错误处理

**实现要点**:
```typescript
async runDev() {
  await this.builder.build({ module: 'entry', mode: 'debug' });
  await this.installer.install({ replace: true });
  await this.launcher.launch({ bundleName });
  await this.logger.follow({ filter: bundleName });
}
```

**验证方式**:
```bash
hdc workflow dev
```

---

## Phase 3: 配置和工具

### 3.1 配置管理
**文件**: `src/modules/config/manager.ts`

**功能**:
1. 读取 `~/.hdc/config.yaml`
2. 提供默认配置
3. 保存配置

### 3.2 项目检测
**文件**: `src/modules/project/locator.ts`

**功能**:
1. 检测 HarmonyOS 项目
2. 查找项目根目录
3. 识别模块

**检测规则**:
- 存在 `hvigorw` 文件
- 存在 `AppScope` 目录
- 存在 `build-profile.json5`

---

## Phase 4: 增强功能

### 4.1 文件监听
使用 `chokidar` 监听文件变化

```typescript
import chokidar from 'chokidar';

chokidar.watch('entry/src').on('change', async () => {
  console.log('文件变化，重新构建...');
  await build();
  await install();
});
```

### 4.2 JSON 输出模式
便于 Claude 解析

```typescript
if (options.json) {
  console.log(JSON.stringify({
    type: 'build_complete',
    status: 'success',
    hap_path: '/path/to/app.hap'
  }));
}
```

### 4.3 进度显示
使用 `ora` 显示加载动画

```typescript
import ora from 'ora';

const spinner = ora('正在构建...').start();
await build();
spinner.succeed('构建成功');
```

---

## Phase 5: 测试和文档

### 5.1 单元测试
使用 Vitest

```typescript
import { describe, it, expect } from 'vitest';
import { HvigorBuilder } from '../src/modules/builder/hvigor';

describe('HvigorBuilder', () => {
  it('should build project', async () => {
    const builder = new HvigorBuilder('/tmp/test');
    // 测试代码
  });
});
```

### 5.2 集成测试
需要真实设备/模拟器

```bash
# 设置测试环境变量
export TEST_MODE=integration
export TEST_DEVICE=192.168.1.100:5555
npm test
```

---

## 开发优先级

### P0 - 核心功能（必须）
1. ✅ 项目框架
2. 🔲 version 命令
3. 🔲 build 命令
4. 🔲 device list 命令
5. 🔲 install 命令
6. 🔲 launch 命令
7. 🔲 log 命令

### P1 - 重要功能
8. 🔲 workflow dev 命令
9. 🔲 配置文件支持
10. 🔲 项目自动检测
11. 🔲 错误处理优化

### P2 - 增强功能
12. 🔲 文件监听
13. 🔲 JSON 输出模式
14. 🔲 日志颜色高亮
15. 🔲 进度条显示

---

## 验证清单

### 基础验证
- [ ] `npm install` 成功
- [ ] `npm run build` 成功
- [ ] `npm run dev -- --version` 输出版本信息
- [ ] `npm run dev -- --help` 显示帮助信息

### 命令验证
- [ ] `hdc build` 构建成功
- [ ] `hdc device list` 列出设备
- [ ] `hdc install` 安装成功
- [ ] `hdc launch` 启动成功
- [ ] `hdc log` 显示日志
- [ ] `hdc workflow dev` 完整流程成功

### 边缘情况
- [ ] 设备未连接时提示
- [ ] 构建失败时显示错误
- [ ] HAP 文件不存在时提示
- [ ] 应用未安装时 launch 提示

---

## 待解决问题

### 1. HAP 文件自动查找
不同项目的 HAP 输出路径可能不同，需要：
- 读取 `build-profile.json5`
- 解析输出配置
- 支持配置文件覆盖

### 2. 日志格式解析
hilog 的输出格式需要实际测试确认

### 3. 跨平台兼容性
- Windows: `hvigorw.bat`
- Linux/macOS: `./hvigorw`

### 4. 设备选择持久化
如何保存用户选择的默认设备？
- 配置文件
- 环境变量
- 本地缓存

---

## 下一步

1. 实现 `version` 命令（最简单）
2. 实现 `device list` 命令（不需要项目）
3. 实现 `build` 命令（核心功能）
4. 逐步完善其他命令
