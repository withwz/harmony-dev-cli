# MVP 最小可行计划

## 目标

做最简单好用的版本：
1. 构建项目
2. 查看构建日志
3. 提取构建错误信息

## 三个命令

### 1. hv build
```bash
cd /path/to/harmony-project
hv build

# 输出构建日志，构建完成显示结果
```

### 2. hv log
```bash
hv log

# 输出应用运行日志（实时）
```

### 3. hv install
```bash
hv install

# 安装构建好的 HAP 到设备
```

## 暂时不做

- ❌ 设备管理 (device list/select)
- ❌ 工作流 (workflow dev)
- ❌ 文件监听
- ❌ 配置文件
- ❌ JSON 输出模式

## 实现顺序

1. **version** - 验证框架
2. **build** - 核心功能
3. **install** - 核心功能
4. **log** - 核心功能

## 验收标准

```bash
# 1. 构建一个 HarmonyOS 项目
cd my-harmony-app
hv build

# 2. 能看到构建日志
> Task :entry:assembleHap
> BUILD SUCCESSFUL

# 3. 构建失败能看到错误
❌ Build Failed
   File: entry/src/main/ets/pages/Index.ets:42
   Error: Cannot find name 'xxx'
```

就这么简单！
