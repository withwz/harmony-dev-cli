import { Command } from 'commander';
import { WorkflowRunner } from '../modules/workflow/runner.js';

export const workflowCommand = new Command('workflow')
  .description('工作流集成');

const workflowRunner = new WorkflowRunner();

workflowCommand
  .command('dev')
  .description('开发工作流：构建 → 安装 → 启动 → 查看日志')
  .option('--watch', '监听文件变化自动重新构建安装')
  .option('--events', '事件流模式输出')
  .action(async (options) => {
    try {
      await workflowRunner.runDev(options);
    } catch (error) {
      console.error('❌ 工作流执行失败:', error);
      process.exit(1);
    }
  });

workflowCommand
  .command('test')
  .description('测试工作流：构建 → 安装 → 运行测试')
  .action(async () => {
    try {
      await workflowRunner.runTest();
    } catch (error) {
      console.error('❌ 工作流执行失败:', error);
      process.exit(1);
    }
  });

workflowCommand
  .command('deploy')
  .description('部署工作流：构建 → 安装')
  .action(async () => {
    try {
      await workflowRunner.runDeploy();
    } catch (error) {
      console.error('❌ 工作流执行失败:', error);
      process.exit(1);
    }
  });
