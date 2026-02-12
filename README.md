# HarmonyOS Dev CLI

> 独立于 DevEco Studio 的 HarmonyOS 开发命令行工具

[![Node Version](https://img.shields.io/badge/Node-18+-brightgreen?style=flat&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 简介

HarmonyOS Dev CLI 是一个命令行工具，让 HarmonyOS 项目可以脱离 DevEco Studio 运行。支持项目构建、应用安装、日志查看等功能，特别适合与 Claude 等 LLM 对接调试。

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

## 使用

### 基本命令

```bash
# 查看版本
hdc --version

# 构建项目
hdc build

# 构建指定模块
hdc build entry

# 清理后构建
hdc build --clean

# 安装应用
hdc install

# 强制覆盖安装
hdc install --force

# 启动应用
hdc launch com.example.app

# 重启应用
hdc launch com.example.app --restart

# 查看日志
hdc log

# 实时跟踪日志
hdc log --follow

# 过滤日志
hdc log --filter "MyApp"
```

### 设备管理

```bash
# 列出所有设备
hdc device list

# 选择设备
hdc device select <device-id>

# 查看设备信息
hdc device info
```

### 工作流

```bash
# 开发工作流（构建 → 安装 → 启动 → 查看日志）
hdc workflow dev

# 监听模式（文件变化自动重新构建）
hdc workflow dev --watch
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 构建
npm run build

# 运行测试
npm test

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 目录结构

```
harmony-dev-cli/
├── src/
│   ├── cli.ts                 # CLI 入口
│   ├── commands/              # 命令实现
│   │   ├── build.ts
│   │   ├── install.ts
│   │   ├── launch.ts
│   │   ├── log.ts
│   │   ├── device.ts
│   │   └── workflow.ts
│   ├── modules/               # 核心模块
│   │   ├── builder/           # 构建模块
│   │   ├── installer/         # 安装模块
│   │   ├── launcher/          # 启动模块
│   │   ├── logger/            # 日志模块
│   │   ├── device/            # 设备模块
│   │   ├── config/            # 配置模块
│   │   └── project/           # 项目模块
│   ├── utils/                 # 工具函数
│   └── types/                 # TypeScript 类型定义
├── package.json
├── tsconfig.json
└── README.md
```

## 配置

配置文件位置: `~/.hdc/config.yaml`

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

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
