# HarmonyOS Dev CLI (hv)

> 脱离 DevEco Studio 开发 HarmonyOS 应用，支持 Claude MCP

## 为什么用这个工具？

**DevEco Studio 的痛点：**
- IDE 太重，只为构建和查看日志就得打开
- 构建错误信息混乱，截图给 LLM 不够清晰

**用 CLI 工具：**
```
修改代码 → hv build → 清晰的错误 → LLM 直接理解并修复
```

## 安装

```bash
# 前置要求
# - Node.js 18+
# - HarmonyOS SDK (hvigorw, hdc)

git clone https://github.com/a0000/harmony-dev-cli.git
cd harmony-dev-cli
npm install -g .
```

## 快速开始

```bash
# 1. 进入你的 HarmonyOS 项目
cd /path/to/your/harmony-project

# 2. 构建项目
hv build

# 3. 安装到设备
hv install

# 4. 查看实时日志
hv log -f
```

## 命令说明

### hv build - 构建项目

```bash
hv build              # 构建默认模块 (entry)
hv build entry        # 构建指定模块
```

**构建成功：**
```
🔨 正在构建模块: entry
执行: hvigorw assembleHap
✅ 构建成功
```

**构建失败：**
```
❌ 构建失败
错误信息会清晰显示，方便复制给 LLM 分析
```

### hv install - 安装到设备

```bash
hv install            # 自动查找 HAP 文件并安装
hv install ./app.hap  # 安装指定文件
```

**安装成功：**
```
📦 正在安装应用...
执行: hdc install entry-default-unsigned.hap
✅ 安装成功
```

### hv log - 查看日志

```bash
hv log                # 查看所有日志
hv log -f             # 实时跟踪日志（推荐）
```

**日志输出示例：**
```
02-13 11:01:33.880  1360  1360 I A01c06/ICON: AppName: updateShadowOption
02-13 11:01:33.880  1360  1360 I A01b01/HOME: ComponentPosShadowCache: getCache
```

## 典型使用场景

### 场景 1：与 Claude 协作开发

```bash
# 1. Claude 修改了代码
# 2. 你运行构建
hv build

# 3. 如果有错误，直接把错误信息复制给 Claude
#    错误信息格式清晰，Claude 能理解并修复

# 4. 修复后重新构建安装
hv build && hv install

# 5. 查看运行日志确认
hv log -f
```

### 场景 2：快速调试循环

```bash
# 修改代码后一条命令完成
hv build && hv install && hv log -f
```

## 与 DevEco Studio 对照

| 操作 | DevEco Studio | hv 命令 |
|------|---------------|---------|
| 构建项目 | Build → Build Hap(s) | `hv build` |
| 安装到设备 | Run → Run 'entry' | `hv install` |
| 查看日志 | 底部 HiLog 窗口 | `hv log -f` |

## Claude MCP 集成

本工具提供 MCP Server，让 Claude Desktop 能够直接调用 HarmonyOS 开发命令。

### 安装 MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 配置 Claude Desktop

编辑 Claude Desktop 配置文件（macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`）：

```json
{
  "mcpServers": {
    "harmonyos": {
      "command": "node",
      "args": ["/Users/a0000/Desktop/myproject/harmony-dev-cli/mcp-server/dist/index.js"]
    }
  }
}
```

### Claude 使用示例

重启 Claude Desktop 后，你可以直接与 Claude 对话：

```
你: 帮我构建 HarmonyOS 项目
Claude: [调用 hv_build 工具] 构建完成

你: 查看应用日志
Claude: [调用 hv_log 工具] 显示最新日志...

你: 构建失败了，看看什么问题
Claude: [调用 hv_build，分析错误] 找到问题了，是类型错误...
```

### 可用 MCP 工具

| 工具 | 说明 |
|------|------|
| `hv_build` | 构建项目 |
| `hv_install` | 安装到设备 |
| `hv_log` | 查看日志 |
| `hv_doctor` | 环境检查 |

## 开发

```bash
npm install     # 安装依赖
npm run dev     # 开发模式运行
npm run build   # 构建 TypeScript
npm test        # 运行测试
```

## License

MIT
