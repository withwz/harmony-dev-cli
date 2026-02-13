# 开发计划

## 目标

脱离 DevEco Studio 运行 HarmonyOS 项目，方便日志查看和 LLM 协作调试。

## MVP (已完成)

- ✅ hv build - 调用 hvigorw 构建
- ✅ hv install - 调用 hdc install 安装
- ✅ hv log - 调用 hilog 查看日志

## 技术栈

- TypeScript + Node.js (ESM)
- Commander.js (CLI 框架)
- execa (执行命令)
- ora (loading 效果)
- chalk (颜色输出)

## 目录结构

```
src/
├── cli.ts              # CLI 入口
├── commands/           # 命令实现
│   ├── build.ts
│   ├── install.ts
│   └── log.ts
└── modules/            # 核心模块
    ├── builder/        # hvigorw 封装
    ├── installer/      # hdc install 封装
    └── logger/         # hilog 封装
```

## 暂不做

- ❌ 设备管理 (device list/select)
- ❌ 应用控制 (launch start/stop)
- ❌ 工作流 (workflow dev)
- ❌ 文件监听 (--watch)
- ❌ JSON 输出 (--json)
- ❌ 配置文件

## 依赖的外部命令

- `hvigorw` / `hvigorw.bat` - 构建
- `hdc` / `hdc.exe` - 设备工具
- `hdc shell hilog` - 日志
