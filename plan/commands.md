# 核心命令设计

## 命令总览

```
hdc
├── build [module]          # 构建项目
├── install [hap-path]      # 安装应用
├── launch <bundle-name>    # 启动/停止/重启应用
├── log                     # 查看日志
├── device                  # 设备管理
│   ├── list               # 列出设备
│   ├── select <id>        # 选择设备
│   ├── info               # 设备信息
│   └── shell              # 进入 shell
└── workflow               # 工作流
    ├── dev                # 开发工作流
    ├── test               # 测试工作流
    └── deploy             # 部署工作流
```

---

## 1. build - 构建命令

### 功能
封装 hvigorw 构建工具，编译 HarmonyOS 项目

### 用法
```bash
hdc build [module] [options]
```

### 参数
| 参数 | 说明 | 默认值 |
|------|------|--------|
| module | 模块名称 | entry |

### 选项
| 选项 | 说明 | 默认值 |
|------|------|--------|
| --clean | 清理后构建 | false |
| --watch | 监听文件变化自动构建 | false |
| --debug | Debug 模式 | true |
| --release | Release 模式 | false |

### 示例
```bash
# 构建默认模块 (Debug)
hdc build

# 构建 entry 模块 (Debug)
hdc build entry

# 清理后构建
hdc build --clean

# Release 模式构建
hdc build --release

# 监听模式（文件变化自动重新构建）
hdc build --watch
```

### 底层命令
```bash
# Debug 构建
./hvigorw assembleHap

# Release 构建
./hvigorw assembleHap --mode release -Dprofile=release

# 清理构建
./hvigorw clean --no-daemon
```

---

## 2. install - 安装命令

### 功能
使用 hdc install 将 HAP 文件安装到设备

### 用法
```bash
hdc install [hap-path] [options]
```

### 参数
| 参数 | 说明 | 默认值 |
|------|------|--------|
| hap-path | HAP 文件路径 | 自动查找 |

### 选项
| 选项 | 说明 | 默认值 |
|------|------|--------|
| -f, --force | 覆盖安装 | false |
| -r, --replace | 替换现有应用 | false |

### 示例
```bash
# 自动查找并安装 HAP
hdc install

# 安装指定 HAP 文件
hdc install ./entry/build/default/outputs/default/entry-default.hap

# 强制覆盖安装
hdc install --force

# 替换现有应用
hdc install -r
```

### 底层命令
```bash
# 基本安装
hdc install app.hap

# 覆盖安装
hdc install -f app.hap

# 替换安装
hdc install -r app.hap
```

### HAP 文件位置规则
```
{module}/build/{mode}/outputs/default/{module}-{mode}.hap

例如:
- entry/build/default/outputs/default/entry-default.hap
- entry/build/release/outputs/default/entry-release.hap
```

---

## 3. launch - 启动命令

### 功能
控制应用生命周期：启动、停止、重启

### 用法
```bash
hdc launch <bundle-name> [options]
```

### 参数
| 参数 | 说明 | 必需 |
|------|------|------|
| bundle-name | 应用包名 | 是 |

### 选项
| 选项 | 说明 | 默认值 |
|------|------|--------|
| --restart | 重启应用 | false |
| --stop | 停止应用 | false |
| --ability <name> | 指定 Ability 名称 | MainAbility |

### 示例
```bash
# 启动应用
hdc launch com.example.app

# 启动指定 Ability
hdc launch com.example.app --ability MainAbility

# 停止应用
hdc launch com.example.app --stop

# 重启应用
hdc launch com.example.app --restart
```

### 底层命令
```bash
# 启动应用
hdc shell aa start -a MainAbility -b com.example.app

# 停止应用
hdc shell aa force-stop com.example.app

# 重启应用（先停止再启动）
hdc shell aa force-stop com.example.app
hdc shell aa start -a MainAbility -b com.example.app
```

---

## 4. log - 日志命令

### 功能
查看和过滤 HarmonyOS 应用日志

### 用法
```bash
hdc log [options]
```

### 选项
| 选项 | 说明 | 默认值 |
|------|------|--------|
| -f, --follow | 实时跟踪日志 | false |
| --filter <pattern> | 过滤日志 | - |
| --clear | 清空日志缓冲区 | false |
| -l, --level <level> | 日志级别 (E/W/I/D) | - |
| --since <time> | 最近时间的日志 | - |
| -o, --save <file> | 保存日志到文件 | - |

### 日志级别
| 级别 | 说明 | 颜色 |
|------|------|------|
| E | Error | 红色 |
| W | Warning | 黄色 |
| I | Info | 绿色 |
| D | Debug | 青色 |

### 示例
```bash
# 查看所有日志
hdc log

# 实时跟踪日志
hdc log --follow
hdc log -f

# 过滤日志
hdc log --filter "MyApp"

# 只显示错误日志
hdc log --level E

# 最近 1 小时的日志
hdc log --since 1h

# 保存日志到文件
hdc log --save output.txt

# 清空日志缓冲区
hdc log --clear

# 组合使用
hdc log -f --filter "MyApp" --level I
```

### 底层命令
```bash
# 查看日志
hdc shell hilog

# 实时日志
hdc shell hilog -T

# 按级别过滤
hdc shell hilog -L I

# 清空日志
hdc shell hilog -r
```

---

## 5. device - 设备管理命令

### 功能
管理连接的 HarmonyOS 设备

### 子命令

#### 5.1 device list - 列出设备
```bash
hdc device list
```

**输出示例：**
```
📱 已连接的设备:
  1. 192.168.1.100:5555 - HUAWEI-P50 (online)
  2. 192.168.1.101:5555 - HUAWEI-Mate40 (online)
```

#### 5.2 device select - 选择设备
```bash
hdc device select <device-id>
```

**示例：**
```bash
hdc device select 192.168.1.100:5555
```

#### 5.3 device info - 设备信息
```bash
hdc device info
```

**输出示例：**
```
📱 当前设备信息:
  ID: 192.168.1.100:5555
  名称: HUAWEI-P50
  状态: online
  类型: harmonyos
```

#### 5.4 device shell - 进入设备 Shell
```bash
hdc device shell
```

### 底层命令
```bash
# 列出设备
hdc list targets

# 指定设备执行命令
hdc -t <device-id> shell <command>
```

---

## 6. workflow - 工作流命令

### 功能
执行预定义的开发工作流，简化日常操作

### 子命令

#### 6.1 workflow dev - 开发工作流
```bash
hdc workflow dev [options]
```

**选项：**
| 选项 | 说明 | 默认值 |
|------|------|--------|
| --watch | 监听文件变化自动重新构建安装 | false |
| --events | 事件流模式输出（JSON） | false |

**流程：**
1. 构建 (build)
2. 安装 (install)
3. 启动 (launch)
4. 查看日志 (log --follow)

**示例：**
```bash
# 执行开发工作流
hdc workflow dev

# 监听模式
hdc workflow dev --watch

# 事件流模式（便于 Claude 解析）
hdc workflow dev --events
```

#### 6.2 workflow test - 测试工作流
```bash
hdc workflow test
```

**流程：**
1. 构建 (build)
2. 安装 (install)
3. 运行测试

#### 6.3 workflow deploy - 部署工作流
```bash
hdc workflow deploy
```

**流程：**
1. Release 构建 (build --release)
2. 安装 (install --force)

---

## 7. 全局选项

```bash
hdc [global-options] <command> [args]

全局选项:
  --version     显示版本信息
  -h, --help    显示帮助信息
  --json        以 JSON 格式输出（便于 Claude 解析）
  -v, --verbose 显示详细输出
```

---

## 8. 配置文件

配置文件位置：`~/.hdc/config.yaml`

```yaml
# 项目配置
project:
  root: .                          # 项目根目录
  modules:
    - name: entry                   # 模块名称
      default: true                 # 是否默认模块
  hap_output: entry/build/default/outputs/default  # HAP 输出目录

# 设备配置
device:
  default: auto                     # 默认设备选择
  timeout: 30s                      # 连接超时

# 构建配置
build:
  hvigorw: ./hvigorw               # hvigorw 路径
  mode: debug                      # 构建模式

# 日志配置
log:
  level: I                         # 默认日志级别
  filters: []                      # 默认过滤规则
  color: true                      # 颜色输出
```

---

## 9. 输出格式

### 标准输出
```
🔨 正在构建模块: entry
✅ 构建成功
📦 正在安装应用...
✅ 安装成功
```

### JSON 输出 (--json)
```json
{"type":"build_start","module":"entry"}
{"type":"build_complete","status":"success","hap_path":"..."}
{"type":"install_start","device":"..."}
{"type":"install_complete","status":"success"}
```

---

## 10. 错误处理

### 错误输出示例
```
❌ 构建失败
   文件: entry/src/main/ets/pages/Index.ets:42
   错误: Property 'xxx' does not exist
   建议: 移除未定义的属性或导入所需模块
```

### 常见错误
| 错误 | 原因 | 解决方案 |
|------|------|----------|
| hdc: command not found | HDC 工具未安装 | 安装 HarmonyOS SDK |
| No devices found | 设备未连接 | 连接设备并开启 USB 调试 |
| Build failed | 编译错误 | 检查代码错误信息 |
| Install failed | 安装失败 | 检查设备存储空间 |
