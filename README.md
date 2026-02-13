# HarmonyOS MCP Server

> Claude MCP Server for HarmonyOS development - 让 Claude Desktop 能直接构建、安装、调试 HarmonyOS 应用

## 为什么用这个工具？

**DevEco Studio 的痛点：**
- IDE 太重，只为构建和查看日志就得打开
- 构建错误信息混乱，截图给 LLM 不够清晰

**用 MCP 工具：**
```
你: 帮我构建 HarmonyOS 项目
Claude: [调用 hv_build 工具] 构建完成

你: 构建失败了，看看什么问题
Claude: [调用 hv_build，分析错误] 找到问题了，是类型错误...
```

## 安装

### 1. 克隆项目

```bash
git clone https://github.com/a0000/harmony-dev-cli.git
cd harmony-dev-cli/mcp-server
```

### 2. 安装依赖并构建

```bash
npm install
npm run build
```

### 3. 配置 Claude Desktop

编辑 Claude Desktop 配置文件：

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "harmonyos-control": {
      "command": "node",
      "args": ["/path/to/harmony-dev-cli/mcp-server/dist/index.js"]
    }
  }
}
```

### 4. 重启 Claude Desktop

重启后 MCP 工具自动加载。

## 可用工具

| 工具 | 说明 |
|------|------|
| `hv_build` | 构建 HarmonyOS 项目 |
| `hv_install` | 安装 HAP 到设备 |
| `hv_log` | 查看应用日志 |
| `hv_doctor` | 检查开发环境 |

## 使用示例

重启 Claude Desktop 后，直接对话：

```
你: 帮我检查一下开发环境
Claude: [调用 hv_doctor] ✅ Node.js v20.x.x
                      ✅ hvigorw 已安装
                      ✅ hdc 已安装
                      ✅ 设备已连接

你: 构建我的项目
Claude: [调用 hv_build] 🔨 正在构建...
                      ✅ 构建成功

你: 查看应用日志
Claude: [调用 hv_log] 显示最新日志...
```

## CLI 工具

如果你想直接使用命令行工具，详见 [plan/CLI-USAGE.md](plan/CLI-USAGE.md)。

## License

MIT
