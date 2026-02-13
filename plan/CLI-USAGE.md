# CLI 使用说明

> hv 命令行工具 - 直接使用 HarmonyOS 开发命令

## 安装

```bash
git clone https://github.com/a0000/harmony-dev-cli.git
cd harmony-dev-cli
npm install -g .
```

**前置要求：**
- Node.js 18+
- HarmonyOS SDK (hvigorw, hdc)

## 快速开始

```bash
# 进入你的 HarmonyOS 项目
cd /path/to/your/harmony-project

# 构建项目
hv build

# 安装到设备
hv install

# 启动应用
hv start

# 查看实时日志
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
hv log                # 查看所有日志（默认只显示 I/W/E 级别）
hv log -f             # 实时跟踪日志
hv log --filter "关键字"  # 过滤日志
hv log --level E      # 只显示错误
```

**日志输出示例：**
```
02-13 11:01:33.880  1360  1360 I A01c06/ICON: AppName: updateShadowOption
02-13 11:01:33.880  1360  1360 I A01b01/HOME: ComponentPosShadowCache: getCache
```

### hv start - 启动应用

```bash
hv start              # 自动读取配置启动
hv start -b com.example.app -a EntryAbility  # 指定参数启动
```

**启动成功：**
```
🚀 正在启动应用...
   包名: com.example.myapplication
   Ability: EntryAbility
   模块: entry

✅ 应用已启动
```

**说明：**
- 默认自动读取项目配置（`AppScope/app.json5`）
- Ability 名称从 `entry/src/main/ets/entryability/*.ets` 文件名获取

## 使用场景

### 与 Claude 协作开发

```bash
# 1. Claude 修改了代码
# 2. 你运行构建
hv build

# 3. 如果有错误，直接把错误信息复制给 Claude
#    错误信息格式清晰，Claude 能理解并修复

# 4. 修复后重新构建安装
hv build && hv install

# 5. 启动应用并查看日志
hv start && hv log -f
```

### 快速调试循环

```bash
# 修改代码后一条命令完成
hv build && hv install && hv start && hv log -f
```

## 与 DevEco Studio 对照

| 操作 | DevEco Studio | hv 命令 |
|------|---------------|---------|
| 构建项目 | Build → Build Hap(s) | `hv build` |
| 安装到设备 | Run → Run 'entry' | `hv install` |
| 启动应用 | 点击运行按钮 | `hv start` |
| 查看日志 | 底部 HiLog 窗口 | `hv log -f` |

## 开发

```bash
npm install     # 安装依赖
npm run dev     # 开发模式运行
npm run build   # 构建 TypeScript
npm test        # 运行测试
```
