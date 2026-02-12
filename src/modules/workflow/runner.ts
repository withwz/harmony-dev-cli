import { HvigorBuilder } from '../builder/hvigor.js';
import { HDCInstaller } from '../installer/hdc.js';
import { AbilityLauncher } from '../launcher/ability.js';
import { HiLogReader } from '../logger/hilog.js';

/**
 * WorkflowRunner 工作流运行器
 */
export class WorkflowRunner {
  private builder: HvigorBuilder;
  private installer: HDCInstaller;
  private launcher: AbilityLauncher;
  private logger: HiLogReader;

  constructor() {
    this.builder = new HvigorBuilder(process.cwd());
    this.installer = new HDCInstaller();
    this.launcher = new AbilityLauncher();
    this.logger = new HiLogReader();
  }

  /**
   * 运行开发工作流
   */
  async runDev(options: { watch?: boolean; events?: boolean }): Promise<void> {
    console.log('🚀 开始开发工作流...');

    // 1. 构建
    console.log('\n📦 步骤 1/4: 构建项目');
    await this.builder.build({
      module: 'entry',
      clean: false,
      watch: options.watch || false,
      mode: 'debug',
    });

    // 2. 安装
    console.log('\n📲 步骤 2/4: 安装应用');
    await this.installer.install({
      force: true,
      replace: false,
    });

    // 3. 启动
    console.log('\n🎯 步骤 3/4: 启动应用');
    await this.launcher.launch({
      bundleName: 'com.example.app',
      restart: false,
      stop: false,
    });

    // 4. 查看日志
    console.log('\n📋 步骤 4/4: 查看日志');
    await this.logger.follow({});

    if (options.watch) {
      // TODO: 实现文件监听自动重新构建
    }
  }

  /**
   * 运行测试工作流
   */
  async runTest(): Promise<void> {
    console.log('🧪 开始测试工作流...');

    // TODO: 实现测试工作流
    console.log('⚠️  测试工作流待实现');
  }

  /**
   * 运行部署工作流
   */
  async runDeploy(): Promise<void> {
    console.log('🚀 开始部署工作流...');

    // 1. 构建
    console.log('\n📦 步骤 1/2: 构建项目');
    await this.builder.build({
      module: 'entry',
      clean: false,
      watch: false,
      mode: 'release',
    });

    // 2. 安装
    console.log('\n📲 步骤 2/2: 安装应用');
    await this.installer.install({
      force: true,
      replace: false,
    });

    console.log('\n✅ 部署完成');
  }
}
