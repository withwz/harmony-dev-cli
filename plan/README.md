# HarmonyOS Dev CLI 工具开发计划

## 项目概述

**目标**: 开发一个命令行工具，让 HarmonyOS 项目可以脱离 DevEco Studio 运行，方便日志查看和与 Claude 对接调试。

**核心价值**:
- 独立于 IDE 的开发/调试流程
- 便于 CI/CD 集成
- 更好的 LLM（如 Claude）协作体验
- 简化日常开发操作

---

## 一、需求分析

### 1.1 核心功能需求

| 功能 | 优先级 | 说明 |
|------|--------|------|
| 项目构建 | P0 | hvigorw 命令封装 |
| 应用安装 | P0 | 安装 HAP 到设备 |
| 应用启动 | P0 | 启动/重启应用 |
| 日志查看 | P0 | 实时日志流式输出 |
| 设备管理 | P1 | 设备列表、选择设备 |
| 文件同步 | P1 | 代码修改后自动构建 |
| 状态检查 | P1 | 设备连接状态、应用状态 |
| 调试接口 | P2 | 端口转发、HDC 连接 |

### 1.2 使用场景

```
场景 1: Claude 协作开发
用户: "帮我修改登录逻辑"
Claude: 修改代码 → 自动触发构建 → 自动安装 → 实时查看日志

场景 2: 远程开发
SSH 连接到开发机 → 运行 CLI 工具 → 查看日志

场景 3: CI/CD
构建 → 部署 → 健康检查
```

---

## 二、技术方案

### 2.1 技术选型

| 方案 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| Shell 脚本 | 简单、原生 | 跨平台差、维护困难 | ❌ |
| Node.js | 生态好、跨平台 | 依赖较重 | ⭕ |
| Python | 生态好、易读 | 依赖管理问题 | ⭕ |
| Rust | 性能好、无依赖 | 学习曲线陡 | ⭕ |
| Go | 编译单文件、跨平台 | 生态一般 | ✅ **推荐** |

**推荐方案**: Go 语言
- 编译为单个可执行文件，无依赖
- 跨平台编译简单
- 并发性能好（日志流处理）
- 标准库完善

### 2.2 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        harmony-dev-cli                       │
├─────────────────────────────────────────────────────────────┤
│  CLI 层    │  build │ install │ launch │ log │ device │ status │
├─────────────────────────────────────────────────────────────┤
│  核心层    │  Builder │ Installer │ Launcher │ Logger │ Device │
├─────────────────────────────────────────────────────────────┤
│  工具层    │  hdc │ hvigor │ adb │ file-watcher │ process  │
├─────────────────────────────────────────────────────────────┤
│  平台层    │  HarmonyOS │ Windows │ Linux │ macOS │ Android │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、功能详细设计

### 3.1 项目构建 (build)

```bash
# 基本用法
hdc build [module]

# 示例
hdc build                    # 构建默认模块
hdc build entry             # 构建 entry 模块
hdc build --watch           # 监听文件变化自动构建
hdc build --clean           # 清理后构建
hdc build --debug           # Debug 模式
hdc build --release         # Release 模式
```

**实现要点**:
- 调用 `hvigorw` 或 `hvigorw.bat`
- 解析构建输出，提取错误/警告
- 返回构建结果（成功/失败）

### 3.2 应用安装 (install)

```bash
hdc install [hap-path]
hdc install --force          # 覆盖安装
hdc install --replace        # 替换现有应用
hdc install --r              # 替换现有应用（短选项）
```

**实现要点**:
- 使用 `hdc install` 命令
- 自动查找 HAP 文件位置
- 支持从构建输出直接安装

### 3.3 应用启动 (launch)

```bash
hdc launch <bundle-name>
hdc launch --restart         # 重启应用
hdc launch --stop            # 停止应用
hdc launch com.example.app --ability MainAbility
```

**实现要点**:
- 使用 `hdc shell aa start`
- 支持停止和重启操作
- 获取启动状态

### 3.4 日志查看 (log)

```bash
hdc log                      # 显示所有日志
hdc log --follow             # 实时跟踪日志（类似 tail -f）
hdc log --filter "MyApp"     # 过滤日志
hdc log --clear              # 清空日志缓冲区
hdc log --level E            # 只显示错误日志
hdc log --since 1h           # 最近1小时的日志
hdc log --save log.txt       # 保存日志到文件
```

**实现要点**:
- 使用 `hdc shell hilog`
- 流式输出，支持颜色高亮
- 支持多过滤器组合
- 可保存到文件

### 3.5 设备管理 (device)

```bash
hdc device list              # 列出所有设备
hdc device select <id>       # 选择设备
hdc device info              # 显示当前设备信息
hdc device shell             # 进入设备 shell
```

**实现要点**:
- 使用 `hdc list targets`
- 维护默认设备选择
- 支持多设备切换

### 3.6 工作流集成 (workflow)

```bash
# 开发工作流：一键完成
hdc workflow dev             # 构建 → 安装 → 启动 → 查看日志
hdc workflow test            # 构建 → 安装 → 运行测试
hdc workflow deploy          # 构建 → 安装

# 监听模式
hdc workflow dev --watch     # 文件变化自动重新构建安装
```

---

## 四、目录结构

```
harmony-dev-cli/
├── cmd/                     # 命令行入口
│   ├── root.go             # 根命令
│   ├── build.go            # build 命令
│   ├── install.go          # install 命令
│   ├── launch.go           # launch 命令
│   ├── log.go              # log 命令
│   ├── device.go           # device 命令
│   └── workflow.go         # workflow 命令
├── internal/               # 内部实现
│   ├── builder/            # 构建模块
│   │   └── hvigor.go
│   ├── installer/          # 安装模块
│   │   └── hdc.go
│   ├── launcher/           # 启动模块
│   │   └── ability.go
│   ├── logger/             # 日志模块
│   │   ├── hilog.go
│   │   ├── filter.go
│   │   └── formatter.go
│   ├── device/             # 设备模块
│   │   └── manager.go
│   ├── config/             # 配置模块
│   │   └── config.go
│   └── project/            # 项目模块
│       └── locator.go
├── pkg/                    # 可导出包
│   └── hdc/               # HDC SDK 封装
├── .config/                # 配置文件
│   └── config.yaml
├── go.mod
├── go.sum
├── Makefile               # 构建脚本
├── main.go                # 入口文件
└── README.md
```

---

## 五、开发阶段规划

### Phase 1: MVP（最小可用版本）- 1-2 天

**目标**: 基本构建 + 安装 + 查看日志

- [x] 项目初始化（Go module）
- [ ] `hdc build` - 封装 hvigorw
- [ ] `hdc install` - 封装 hdc install
- [ ] `hdc log --follow` - 实时日志
- [ ] 基本错误处理

**验收标准**:
```bash
hdc build && hdc install && hdc log --follow
# 能够正常工作
```

### Phase 2: 设备管理 - 0.5 天

- [ ] `hdc device list`
- [ ] `hdc device select`
- [ ] 自动设备选择

### Phase 3: 应用控制 - 0.5 天

- [ ] `hdc launch`
- [ ] `hdc launch --stop`
- [ ] `hdc launch --restart`

### Phase 4: 工作流集成 - 0.5 天

- [ ] `hdc workflow dev`
- [ ] `hdc workflow dev --watch`

### Phase 5: 优化增强 - 1 天

- [ ] 日志高亮和格式化
- [ ] 配置文件支持
- [ ] 自动项目检测
- [ ] 进度条显示
- [ ] 错误信息优化

### Phase 6: Claude 集成特性 - 1 天

- [ ] JSON 输出模式（便于 Claude 解析）
- [ ] 事件流输出
- [ ] 状态查询接口
- [ ] 文档生成

---

## 六、技术难点与解决方案

### 6.1 平台兼容性

| 问题 | 解决方案 |
|------|----------|
| Windows 路径 | 使用 `filepath` 包处理路径 |
| Shell 命令差异 | 使用 `exec.Command` 统一调用 |
| HDC 工具位置 | 支持配置文件指定路径 |

### 6.2 日志实时流

```go
// 使用 io.Reader 流式读取
cmd := exec.Command("hdc", "shell", "hilog", "-T")
stdout, _ := cmd.StdoutPipe()
cmd.Start()

scanner := bufio.NewScanner(stdout)
for scanner.Scan() {
    // 处理每行日志
    logLine := scanner.Text()
    // 格式化输出
}
```

### 6.3 项目检测

```go
// 检测 HarmonyOS 项目
func DetectProject(path string) (*Project, error) {
    // 检查 hvigorw 文件
    // 检查 build-profile.json5
    // 检查 AppScope 目录
}
```

---

## 七、与 Claude 对接设计

### 7.1 JSON 输出模式

```bash
hdc --json build
# 输出: {"status":"success","hap_path":"/path/to/app.hap","time":1234}

hdc --json device list
# 输出: {"devices":[{"id":"123","name":"HarmonyOS Device"}]}

hdc --json log --follow
# 输出流: {"type":"log","level":"I","tag":"MyApp","message":"..."}
```

### 7.2 事件流模式

```bash
hdc workflow dev --events
# 输出流:
# {"type":"build_start","timestamp":...}
# {"type":"build_complete","status":"success","hap_path":...}
# {"type":"install_start","device":"...",...}
# {"type":"install_complete","status":"success",...}
# {"type":"log","level":"I","tag":"MyApp","message":"..."}
```

### 7.3 Claude 友好的错误输出

```bash
hdc build
# 编译失败时:
# ❌ Build Failed
#    File: entry/src/main/ets/pages/Index.ets:42
#    Error: Property 'xxx' does not exist
#    Fix: Remove the undefined property or import the required module
```

---

## 八、配置文件设计

```yaml
# ~/.hdc/config.yaml
project:
  # 项目根目录（自动检测）
  root: .

  # 模块配置
  modules:
    - name: entry
      default: true

  # HAP 输出目录
  hap_output: entry/build/default/outputs/default

device:
  # 默认设备（自动选择第一个）
  default: auto

  # 连接超时
  timeout: 30s

build:
  # hvigorw 路径
  hvigorw: ./hvigorw

  # 构建模式
  mode: debug

log:
  # 日志级别
  level: I

  # 默认过滤
  filters: []

  # 颜色输出
  color: true
```

---

## 九、测试策略

### 9.1 单元测试

```
internal/builder/hvigor_test.go
internal/installer/hdc_test.go
internal/logger/hilog_test.go
internal/device/manager_test.go
```

### 9.2 集成测试

```bash
# 需要真实设备/模拟器
TEST_MODE=integration go test ./...
```

### 9.3 手动测试

| 测试项 | 命令 | 预期结果 |
|--------|------|----------|
| 构建项目 | hdc build | 编译成功 |
| 安装应用 | hdc install | 安装成功 |
| 启动应用 | hdc launch | 应用启动 |
| 查看日志 | hdc log --follow | 实时显示日志 |
| 工作流 | hdc workflow dev | 全流程成功 |

---

## 十、发布计划

### 10.1 版本规划

- **v0.1.0**: MVP（build + install + log）
- **v0.2.0**: 设备管理 + 应用控制
- **v0.3.0**: 工作流集成
- **v0.4.0**: Claude 集成特性
- **v1.0.0**: 正式版

### 10.2 发布渠道

- GitHub Releases
- Homebrew（macOS）
- Scoop（Windows）
| Snap（Linux）

---

## 十一、时间线估算

| 阶段 | 工作量 | 完成时间 |
|------|--------|----------|
| Phase 1: MVP | 1-2 天 | D2 |
| Phase 2-3: 设备与控制 | 1 天 | D3 |
| Phase 4-5: 工作流与优化 | 1.5 天 | D5 |
| Phase 6: Claude 集成 | 1 天 | D6 |
| 测试与文档 | 0.5 天 | D7 |

**总计**: 约 1 周开发时间

---

## 十二、参考资料

- [HarmonyOS hdc 命令文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hdc-command-V5)
- [HarmonyOS hiLog 命令文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-hilog-V5)
- [Go CLI 最佳实践](https://github.com/spf13/cobra)
- [DevEco Studio 命令行构建](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/ide-command-line-building-V5)

---

## 十三、下一步行动

1. **创建项目骨架**
   ```bash
   cd /Users/a0000/Desktop/myproject/harmony-dev-cli
   go mod init github.com/a0000/harmony-dev-cli
   mkdir -p cmd internal/{builder,installer,launcher,logger,device,config,project} pkg/hdc
   ```

2. **实现第一个命令**
   - 选择 `hdc version` 作为起点
   - 验证框架可用性

3. **实现 build 命令**
   - 调用 `hvigorw`
   - 解析输出

---

*文档创建时间: 2025-02-12*
*版本: v0.1.0*
