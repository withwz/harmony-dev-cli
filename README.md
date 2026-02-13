# HarmonyOS Dev CLI

> 不打开 DevEco Studio 也能开发 HarmonyOS 应用

## 为什么

**DevEco Studio 的痛点：**
- IDE 太重，只为构建和查看日志浪费资源
- 日志难读，构建和运行日志混在一起
- 错误信息不清晰，LLM 无法直接读取

**CLI 工具的优势：**
```
修改代码 → hv build → 清晰的错误 → Claude 直接读取
```

## 已实现 (MVP)

| 命令 | 功能 |
|------|------|
| `hv build` | 构建项目 |
| `hv install` | 安装到设备 |
| `hv log` | 查看日志 |

## 安装

```bash
git clone https://github.com/a0000/harmony-dev-cli.git
cd harmony-dev-cli
npm install
npm run build
npm link
```

**前置要求：**
- Node.js 18+
- HarmonyOS SDK (hvigorw, hdc)

## 使用

```bash
# 构建
hv build

# 安装
hv install

# 查看日志
hv log -f
```

## 开发

```bash
npm install    # 安装依赖
npm run dev    # 开发模式
npm run build  # 构建
```

## License

MIT
