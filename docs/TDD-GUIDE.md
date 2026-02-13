# 测试驱动开发 (TDD) 指南

## 什么是 TDD？

**TDD = Test-Driven Development (测试驱动开发)**

传统开发 vs TDD：

```
传统开发：
写代码 → 写测试 → 发现 bug → 修代码 → 再测试

TDD：
写测试 → 测试失败 🔴 → 写最少代码 → 测试通过 🟢 → 重构 🔄
```

---

## TDD 三步循环 (红-绿-重构）

### 1. 🔴 红 - 先写测试

```typescript
// logger.test.ts
describe('Logger', () => {
  it('应该输出 INFO 级别的日志', () => {
    const logger = new Logger();
    logger.info('测试消息');

    expect(console.info).toHaveBeenCalledWith('[INFO] 测试消息');
  });
});
```

运行测试：**失败** (Logger 还没实现)

### 2. 🟢 绿 - 写最少代码通过测试

```typescript
// logger.ts
export class Logger {
  info(message: string) {
    console.info(`[INFO] ${message}`);
  }
}
```

运行测试：**通过** ✅

### 3. 🔄 重构 - 优化代码

```typescript
// 优化：添加格式化、颜色支持
export class Logger {
  private format(level: string, message: string): string {
    return `[${level}] ${message}`;
  }

  info(message: string, ...args: unknown[]) {
    console.info(this.format('INFO', message), ...args);
  }
}
```

运行测试：**依然通过** ✅

---

## 实际示例：实现 DeviceManager

### 第 1 步：先写测试

```typescript
// device/manager.test.ts
describe('DeviceManager', () => {
  it('应该解析 hv list targets 输出', async () => {
    const manager = new DeviceManager();

    // Mock hv 命令返回
    mockExeca.returnValue({
      stdout: '192.168.1.100:5555\n192.168.1.101:5555'
    });

    const devices = await manager.list();

    expect(devices).toHaveLength(2);
    expect(devices[0].id).toBe('192.168.1.100:5555');
  });
});
```

### 第 2 步：运行测试 - 失败 🔴

```bash
npm run test:unit

# ❌ FAIL: DeviceManager is not defined
```

### 第 3 步：写代码通过测试 🟢

```typescript
// device/manager.ts
export class DeviceManager {
  async list() {
    const { stdout } = await execa('hv', ['list', 'targets']);
    const lines = stdout.trim().split('\n');

    return lines.map(id => ({
      id,
      name: 'Unknown',
      state: 'online',
      type: 'harmonyos',
      online: true,
    }));
  }
}
```

### 第 4 步：测试通过 - 重构 🔄

```typescript
// 提取解析逻辑
private parseDeviceList(output: string): Device[] {
  if (output.includes('[Empty]')) return [];

  return output.trim().split('\n').map(id => ({
    id,
    name: 'Unknown',
    state: 'online',
    type: 'harmonyos',
    online: true,
  }));
}
```

---

## 测试类型

### 1. 单元测试 (Unit Tests)

测试单个函数/类，速度快，不依赖外部资源

```bash
npm run test:unit
```

```typescript
// 示例：测试日志格式化函数
describe('formatLog', () => {
  it('应该正确格式化日志', () => {
    const result = formatLog('I', 'MyApp', 'Hello');
    expect(result).toBe('[I] MyApp: Hello');
  });
});
```

### 2. 集成测试 (Integration Tests)

测试模块之间的协作，使用 mock

```bash
npm run test:integration
```

```typescript
// 示例：测试 DeviceManager 调用 execa
describe('DeviceManager', () => {
  it('应该调用 hv list targets', async () => {
    const manager = new DeviceManager();
    await manager.list();

    expect(execa).toHaveBeenCalledWith('hv', ['list', 'targets']);
  });
});
```

### 3. E2E 测试 (End-to-End Tests)

测试完整的用户流程，需要真实环境

```bash
npm run test:e2e
```

```typescript
// 示例：完整构建流程
describe('构建流程', () => {
  it('应该能够构建项目', async () => {
    // 1. 调用 build 命令
    await build('entry');

    // 2. 检查 HAP 文件存在
    const hapExists = fs.existsSync('entry/build/default/outputs/default/entry-default.hap');
    expect(hapExists).toBe(true);
  });
});
```

---

## TDD 开发流程

```bash
# 1. 创建测试文件
touch src/modules/builder/hvigor.test.ts

# 2. 编写测试（会失败）
# ... 写测试代码 ...

# 3. 运行测试 - 红灯 🔴
npm run test:unit

# 4. 编写最少代码让测试通过
# ... 写实现代码 ...

# 5. 运行测试 - 绿灯 🟢
npm run test:unit

# 6. 重构优化
# ... 优化代码 ...

# 7. 再次运行测试 - 依然绿灯 🟢
npm run test:unit

# 8. 提交代码
git add . && git commit -m "feat: 实现 build 命令"
```

---

## 常用断言 (expect)

```typescript
// 相等
expect(value).toBe(expected);
expect(object).toEqual({ foo: 'bar' });

// 真假
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeUndefined();

// 抛出异常
expect(async () => {
  await someFunction();
}).rejects.toThrow('错误消息');

// 调用次数
expect(mockFunction).toHaveBeenCalledTimes(1);
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');

// 包含
expect(array).toContain(item);
expect(string).toContain('substring');
```

---

## Mock 技巧

```typescript
// Mock 函数
vi.fn();
vi.fn().mockReturnValue(42);

// Mock 模块
vi.mock('execa');
import { execa } from 'execa';

// Mock 返回值
vi.mocked(execa).mockResolvedValue({
  stdout: 'output',
  stderr: '',
});

// Mock 实现
vi.mocked(execa).mockImplementation(async (cmd, args) => {
  return { stdout: `mocked ${cmd}` };
});
```

---

## 测试覆盖率

```bash
# 生成覆盖率报告
npm run test:coverage

# 输出：
# % Coverage report
# Statements   85%
# Branches     80%
# Functions    90%
# Lines        85%
```

---

## 项目测试命令

```bash
# 运行所有测试
npm test

# 只运行单元测试
npm run test:unit

# 只运行集成测试
npm run test:integration

# 只运行 E2E 测试
npm run test:e2e

# 监听模式（TDD 时常用）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

---

## TDD 带来的好处

| 好处 | 说明 |
|------|------|
| **更少的 bug** | 测试覆盖了代码 |
| **更好的设计** | 先写测试让代码更易测试 |
| **文档作用** | 测试就是使用文档 |
| **重构信心** | 改代码时测试会发现问题 |
| **即时反馈** | 每次改动都能立即验证 |

---

## 推荐阅读

- [Vitest 文档](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [TDD By Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
