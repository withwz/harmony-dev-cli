# HarmonyOS Dev CLI

独立于 DevEco Studio 的 HarmonyOS 开发命令行工具。

## 功能

脱离 DevEco Studio 运行项目，方便日志查看和与 LLM 协作调试。

### 已实现 (MVP)

| 命令 | 功能 |
|------|------|
| `hv build` | 构建项目 |
| `hv install` | 安装应用到设备 |
| `hv log` | 查看实时日志 |

## 使用

```bash
# 构建项目
hv build

# 安装应用
hv install

# 查看日志
hv log -f
```

## 技术栈

- TypeScript + Node.js (ESM)
- Commander.js
- execa

## 依赖

- Node.js >= 18
- HarmonyOS SDK (hvigorw, hdc)
