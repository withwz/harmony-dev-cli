# 验证清单

## 环境准备

### 前置要求检查
```bash
# Node.js 版本
node --version  # 需要 >= 18.0.0

# npm 版本
npm --version

# HarmonyOS SDK (hdc 命令)
hdc version
hdc list targets

# 查看设备连接状态
hdc shell hilog -T
```

### 安装依赖
```bash
cd /Users/a0000/Desktop/myproject/harmony-dev-cli
npm install
```

---

## 命令验证

### 1. 基础框架验证

```bash
# 构建 TypeScript
npm run build

# 开发模式运行
npm run dev -- --version
npm run dev -- --help
npm run dev -- build --help
```

**预期输出**:
```bash
$ npm run dev -- --version
HarmonyOS Dev CLI v0.1.0
Node: v18.x.x
Platform: darwin/arm64

$ npm run dev -- --help
Usage: hdc [options] [command]

HarmonyOS Dev CLI - 独立于 DevEco Studio 的开发工具

Options:
  -v, --verbose  显示详细输出
  --json         以 JSON 格式输出
  -h, --help     display help for command

Commands:
  build [module]    构建项目
  install [options]  安装应用
  launch <name>     启动/停止/重启应用
  log [options]     查看日志
  device            设备管理
  workflow          工作流
  help [command]    display help for command
```

---

### 2. device 命令验证

**不需要项目，只要有设备连接即可**

```bash
# 列出设备
npm run dev -- device list

# 选择设备
npm run dev -- device select <device-id>

# 查看设备信息
npm run dev -- device info
```

**预期输出**:
```bash
$ npm run dev -- device list
📱 已连接的设备:
  1. 192.168.1.100:5555 - HUAWEI-P50 (online)
```

---

### 3. build 命令验证

**需要一个 HarmonyOS 项目**

```bash
# 进入 HarmonyOS 项目目录
cd /path/to/harmony/project

# 或者从外部指定项目
cd /Users/a0000/Desktop/myproject/harmony-dev-cli
npm run dev -- build
```

**预期输出**:
```bash
$ npm run dev -- build entry
🔨 正在构建模块: entry
   > Task :entry:assembleHap
✅ 构建成功
   HAP 文件: entry/build/default/outputs/default/entry-default.hap
```

---

### 4. install 命令验证

```bash
# 安装应用
npm run dev -- install

# 指定 HAP 文件
npm run dev -- install ./entry/build/default/outputs/default/entry-default.hap

# 强制覆盖
npm run dev -- install --force
```

**预期输出**:
```bash
$ npm run dev -- install
📦 正在安装应用...
   Installing: entry-default.hap
✅ 安装成功
```

---

### 5. launch 命令验证

```bash
# 启动应用（需要包名）
npm run dev -- launch com.example.app

# 停止应用
npm run dev -- launch com.example.app --stop

# 重启应用
npm run dev -- launch com.example.app --restart
```

**预期输出**:
```bash
$ npm run dev -- launch com.example.app
🚀 正在启动应用: com.example.app
✅ 应用已启动

$ npm run dev -- launch com.example.app --stop
🛑 正在停止应用: com.example.app
✅ 应用已停止
```

---

### 6. log 命令验证

```bash
# 查看所有日志
npm run dev -- log

# 实时跟踪
npm run dev -- log --follow

# 过滤日志
npm run dev -- log --filter "MyApp"

# 按级别过滤
npm run dev -- log --level E

# 清空日志
npm run dev -- log --clear
```

**预期输出**:
```bash
$ npm run dev -- log --follow
📋 正在实时跟踪日志...
[I] MyApp: Application started
[I] MyApp: Page loaded
[D] MyApp: Debug info
```

---

### 7. workflow 命令验证

```bash
# 完整开发流程
npm run dev -- workflow dev
```

**预期输出**:
```bash
$ npm run dev -- workflow dev
🚀 开始开发工作流...

📦 步骤 1/4: 构建项目
🔨 正在构建模块: entry
✅ 构建成功

📲 步骤 2/4: 安装应用
📦 正在安装应用...
✅ 安装成功

🎯 步骤 3/4: 启动应用
🚀 正在启动应用: com.example.app
✅ 应用已启动

📋 步骤 4/4: 查看日志
📋 正在实时跟踪日志...
[I] MyApp: Application started
```

---

## 边缘情况验证

### 无设备连接
```bash
npm run dev -- device list
```
**预期**: `⚠️ 未发现连接的设备`

### 构建失败
```bash
# 在有代码错误的项目中构建
npm run dev -- build
```
**预期**: 显示错误信息和建议

### HAP 文件不存在
```bash
npm run dev -- install ./nonexistent.hap
```
**预期**: `❌ HAP 文件不存在`

### 应用未安装时 launch
```bash
npm run dev -- launch com.nonexistent.app
```
**预期**: 显示应用未找到的提示

---

## 性能验证

### 构建时间
```bash
time npm run dev -- build
```
**预期**: 与直接运行 `hvigorw` 时间相近

### 日志内存占用
```bash
# 长时间运行日志
npm run dev -- log --follow
```
**预期**: 内存占用稳定，不泄漏

---

## JSON 输出验证

```bash
npm run dev -- --json device list
```

**预期输出**:
```json
{"type":"device_list","devices":[{"id":"192.168.1.100:5555","name":"HUAWEI-P50","state":"online"}]}
```

---

## 全局安装验证

```bash
# 构建
npm run build

# 全局链接
npm link

# 验证
hdc --version
hdc build --help
```

---

## 清理

```bash
# 清理构建
npm run clean

# 取消全局链接
npm unlink -g
```

---

## 已知问题记录

### 待解决
- [ ] Windows 平台兼容性
- [ ] 多设备选择逻辑
- [ ] HAP 文件自动查找规则

### 已解决
- [x] 项目框架搭建
- [x] TypeScript 配置
- [x] 基础命令结构
