#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { execa } from 'execa';
import { doctor } from './doctor.js';

// MCP Server 实例
const server = new Server(
  {
    name: 'harmonyos-control',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'hv_build',
        description: '构建 HarmonyOS 项目',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: 'HarmonyOS 项目路径',
            },
            module: {
              type: 'string',
              description: '模块名 (默认: entry)',
            },
          },
        },
      },
      {
        name: 'hv_install',
        description: '安装 HAP 到设备',
        inputSchema: {
          type: 'object',
          properties: {
            hapPath: {
              type: 'string',
              description: 'HAP 文件路径',
            },
          },
        },
      },
      {
        name: 'hv_log',
        description: '查看 HarmonyOS 应用日志',
        inputSchema: {
          type: 'object',
          properties: {
            filter: {
              type: 'string',
              description: '过滤关键字',
            },
            level: {
              type: 'string',
              description: '日志级别 (I/W/E/D)',
            },
            lines: {
              type: 'number',
              description: '输出行数',
            },
          },
        },
      },
      {
        name: 'hv_doctor',
        description: '检查 HarmonyOS 开发环境',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description: '项目路径 (可选)',
            },
          },
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'hv_build': {
        const project = args?.project as string | undefined;
        const module = args?.module as string | undefined || 'entry';

        const cmdArgs = ['build'];
        if (module) {
          cmdArgs.push(module);
        }

        const result = await execa('hv', cmdArgs, {
          cwd: project || process.cwd(),
          timeout: 300000,
        });

        return {
          content: [
            {
              type: 'text',
              text: result.stdout || '构建成功',
            },
          ],
        };
      }

      case 'hv_install': {
        const hapPath = args?.hapPath as string | undefined;

        const cmdArgs = ['install'];
        if (hapPath) {
          cmdArgs.push(hapPath);
        }

        const result = await execa('hv', cmdArgs, {
          timeout: 60000,
        });

        return {
          content: [
            {
              type: 'text',
              text: result.stdout || '安装成功',
            },
          ],
        };
      }

      case 'hv_log': {
        const filter = args?.filter as string | undefined;
        const level = args?.level as string | undefined;
        const lines = args?.lines as number | undefined || 50;

        const cmdArgs = ['log'];
        if (filter) {
          cmdArgs.push('--filter', filter);
        }
        if (level) {
          cmdArgs.push('--level', level);
        }

        const result = await execa('hv', cmdArgs, {
          timeout: 10000,
        });

        // 只返回最后 N 行
        const outputLines = (result.stdout || '').split('\n');
        const truncated = outputLines.slice(-lines).join('\n');

        return {
          content: [
            {
              type: 'text',
              text: truncated || '无日志输出',
            },
          ],
        };
      }

      case 'hv_doctor': {
        const project = args?.project as string | undefined;
        const result = await doctor(project);

        const lines = result.checks.map((c) => {
          const icon = c.ok ? '✅' : '❌';
          const fix = c.fix ? `\n   修复: ${c.fix}` : '';
          return `${icon} ${c.name}: ${c.message}${fix}`;
        });

        const summary = result.ok ? '\n✅ 环境检查通过' : '\n⚠️ 存在问题需要修复';

        return {
          content: [
            {
              type: 'text',
              text: lines.join('\n') + summary,
            },
          ],
        };
      }

      default:
        throw new Error(`未知工具: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `错误: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server for HarmonyOS running');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
