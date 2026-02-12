# HarmonyOS Dev CLI

> **不打开 DevEco Studio 也能开发 HarmonyOS 应用**

[![Node Version](https://img.shields.io/badge/Node-18+-brightgreen?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 为什么需要这个工具？

### DevEco Studio 的痛点

1. **IDE 太重** - 打开 IDE 只是为了构建和查看日志，浪费资源
2. **日志难读** - 构建日志和运行日志混在一起，难以过滤
3. **错误不清晰** - 编译错误信息在 IDE 中显示不全，LLM 无法读取
4. **远程开发不便** - SSH 连接到开发机后无法使用图形界面 IDE

### HarmonyOS Dev CLI 的解决方案

```
┌─────────────────────────────────────────────────────────────────┐
│                     传统开发流程                               │
├─────────────────────────────────────────────────────────────────┤
│  打开 DevEco Studio → 等待索引 → 修改代码 → 点击构建 → 查看   │
│  混乱的日志面板 → 截图错误信息 → 复制给 Claude                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     使用 CLI 工具                              │
├─────────────────────────────────────────────────────────────────┤
│  修改代码 → hdc build → 看到清晰的错误 → Claude 直接读取      │
│  → hdc install → hdc launch → hdc log --follow               │
└─────────────────────────────────────────────────────────────────┘
```

## 核心功能

| 功能 | 说明 | 对应 DevEco Studio |
|------|------|-------------------|
| **构建项目** | 命令行调用 hvigorw 构建 | Build → Build Hap(s) |
| **查看构建日志** | 结构化输出，方便 LLM 解析 | Build 窗口（混乱） |
| **查看构建报错** | 高亮显示错误，带文件位置 | Build 窗口（需手动找） |
| **安装到设备** | 一键安装到连接的设备 | Run → Run 'entry' |
| **启动应用** | 命令行启动/停止/重启 | Run/Debug 按钮 |
| **查看运行日志** | 实时流式输出，支持过滤 | HiLog 窗口 |
| **工作流集成** | 一键完成 构建→安装→启动→查看日志 | 需手动操作多次 |

### 核心特性

- **独立构建**: 封装 hvigorw，支持命令行构建
- **应用管理**: 安装、启动、停止、重启应用
- **实时日志**: 流式查看和过滤应用日志
- **设备管理**: 列出和选择连接的设备
- **工作流集成**: 一键完成构建、安装、启动、调试
- **Claude 友好**: JSON 输出模式，便于 LLM 解析

## 安装

### 前置要求

- Node.js 18+
- HarmonyOS SDK (hdc 命令)
- HarmonyOS 项目 (hvigorw 构建脚本)

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/a0000/harmony-dev-cli.git
cd harmony-dev-cli

# 安装依赖
npm install

# 构建
npm run build

# 全局安装
npm link
```

### 直接使用 npx

```bash
npx harmony-dev-cli --help
```

## 使用场景

### 场景 1: 与 Claude 协作开发

```bash
# 1. Claude 修改代码后，你运行构建
hdc build

# 2. 构建失败，错误信息清晰显示
❌ 构建失败
   文件: entry/src/main/ets/pages/Index.ets:42
   错误: Property 'xxx' does not exist on type...
   建议: 检查属性名拼写或导入相应模块

# 3. 直接复制给 Claude，Claude 理解并修复
```

**对比 DevEco Studio**:
- ❌ IDE 错误信息分散，需要截图或手动复制
- ✅ CLI 错误结构化输出，Claude 可直接解析

---

### 场景 2: 远程/轻量开发

```bash
# SSH 连接到开发机，无需图形界面
ssh user@dev-machine

# 进入项目目录，直接构建
cd harmony-project && hdc build

# 安装到设备
hdc install

# 实时查看日志
hdc log --follow
```

**对比 DevEco Studio**:
- ❌ 远程桌面使用 IDE 卡顿
- ✅ SSH + 命令行流畅高效

---

### 场景 3: 快速调试循环

```bash
# 一条命令完成整个流程
hdc workflow dev

# 等价于以下操作：
# 1. 构建
# 2. 安装
# 3. 启动
# 4. 查看日志（实时）
```

---

## 快速开始

### 1. 构建 HarmonyOS 项目

```bash
hdc build

# 输出:
🔨 正在构建模块: entry
   > Task :entry:assembleHap
✅ 构建成功
   HAP: entry/build/default/outputs/default/entry-default.hap
```

### 2. 查看构建日志

```bash
hdc build --verbose

# 输出详细构建过程，方便定位问题
```

### 3. 构建失败时查看错误

```bash
hdc build

# 输出:
❌ 构建失败
   File: entry/src/main/ets/pages/Index.ets:42
   Error: Type 'string' is not assignable to type 'number'
   Fix: 确保类型匹配，或使用 Number() 转换
```

### 4. 安装到设备

```bash
hdc install

# 输出:
📦 正在安装: entry-default.hap
✅ 安装成功 (已替换旧版本)
```

### 5. 查看运行日志

```bash
hdc log --follow

# 实时输出:
[I] MyApp: Application started
[I] MyApp: Page loaded
[D] MyApp: User clicked button
```

---

## 命令参考

### 构建
```bash
hdc build                    # 构建默认模块
hdc build entry             # 构建指定模块
hdc build --clean           # 清理后构建
hdc build --release         # Release 模式
```

### 安装
```bash
hdc install                  # 自动查找 HAP 并安装
hdc install ./app.hap       # 安装指定文件
hdc install --force         # 强制覆盖安装
```

### 运行
```bash
hdc launch com.example.app              # 启动应用
hdc launch com.example.app --stop      # 停止应用
hdc launch com.example.app --restart   # 重启应用
```

### 日志
```bash
hdc log                      # 查看所有日志
hdc log --follow            # 实时跟踪（类似 tail -f）
hdc log --filter "MyApp"    # 过滤日志
hdc log --level E           # 只显示错误
```

### 工作流
```bash
hdc workflow dev             # 一键：构建→安装→启动→查看日志
hdc workflow dev --watch     # 监听文件变化自动重新构建
```

---

## 与 DevEco Studio 对照表

| 操作 | DevEco Studio | CLI 命令 |
|------|---------------|----------|
| 构建项目 | Build → Build Hap(s) | `hdc build` |
| 清理构建 | Build → Clean Project | `hdc build --clean` |
| 安装到设备 | Run → Run 'entry' | `hdc install` |
| 启动应用 | 点击运行按钮 | `hdc launch com.example.app` |
| 停止应用 | 点击停止按钮 | `hdc launch com.example.app --stop` |
| 查看日志 | 底部 HiLog 窗口 | `hdc log --follow` |
| 过滤日志 | HiLog 窗口筛选 | `hdc log --filter "Tag"` |
| 查看设备 | Device Manager | `hdc device list` |

---

## 为什么更适合 LLM 协作？

### 1. 结构化输出

```bash
# CLI 输出 - JSON 模式
hdc --json build

{"type":"build_complete","status":"success","hap_path":"...","time":1234}

# Claude 可以直接解析这个 JSON，理解构建结果
```

### 2. 错误信息清晰

```bash
# CLI 输出
❌ 构建失败
   File: entry/src/main/ets/pages/Index.ets:42
   Line: 42
   Column: 15
   Error: Property 'onClick' does not exist on type 'Div'
   Fix: Add 'onClick' event handler or check property name

# Claude 可以直接读取，不需要截图
```

### 3. 日志可流式读取

```bash
# CLI 输出 - 实时日志流
hdc log --follow --json

{"type":"log","level":"I","tag":"MyApp","message":"App started"}
{"type":"log","level":"E","tag":"MyApp","message":"Network error"}
{"type":"log","level":"I","tag":"MyApp","message":"Retry connection"}

# Claude 可以实时分析日志模式
```

---

## 安装

```bash
# 克隆仓库
git clone https://github.com/withwz/harmony-dev-cli.git
cd harmony-dev-cli

# 安装依赖
npm install

# 构建
npm run build

# 全局安装
npm link
```

### 前置要求
- Node.js 18+
- HarmonyOS SDK (hdc 命令)
- HarmonyOS 项目

---

## 开发

```bash
npm install      # 安装依赖
npm run dev      # 开发模式
npm run build    # 构建
npm test         # 运行测试
```

---

## 配置

配置文件: `~/.hdc/config.yaml`

```yaml
project:
  root: .
  hap_output: entry/build/default/outputs/default

device:
  default: auto
  timeout: 30s

build:
  hvigorw: ./hvigorw
  mode: debug

log:
  level: I
  color: true
```

---

## 许可证

MIT License

