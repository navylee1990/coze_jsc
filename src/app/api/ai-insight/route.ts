import { NextRequest, NextResponse } from 'next/server';
import { LLMClient, Config } from 'coze-coding-dev-sdk';

const config = new Config();
const client = new LLMClient(config);

export async function POST(request: NextRequest) {
  try {
    const { chartType, data } = await request.json();

    // 根据不同的图表类型构建不同的提示词
    const systemPrompts: Record<string, string> = {
      industry: `你是一位商用净水行业的专业经营数据分析师。
请基于提供的数据，生成简洁、专业的图表结论。
要求：
1. 用一句话总结核心发现
2. 指出最重要的趋势或问题
3. 给出1-2条具体可执行的建议
4. 控制在80字以内，语言精炼`,

      grade: `你是一位商用净水行业的专业经营数据分析师。
请基于提供的数据，生成简洁、专业的图表结论。
要求：
1. 指出项目等级分布的特点
2. 分析不同等级项目的健康情况
3. 给出资源分配建议
4. 控制在80字以内，语言精炼`,

      node: `你是一位商用净水行业的专业经营数据分析师。
请基于提供的数据，生成简洁、专业的图表结论。
要求：
1. 分析各节点的转化率情况
2. 指出瓶颈环节
3. 给出优化建议
4. 控制在80字以内，语言精炼`,

      risk: `你是一位商用净水行业的专业经营数据分析师。
请基于提供的数据，生成简洁、专业的图表结论。
要求：
1. 指出高风险项目的规模
2. 分析风险来源
3. 给出风险管控建议
4. 控制在80字以内，语言精炼`,

      stagnant: `你是一位商用净水行业的专业经营数据分析师。
请基于提供的数据，生成简洁、专业的图表结论。
要求：
1. 指出停滞项目的情况
2. 分析停滞原因
3. 给出跟进建议
4. 控制在80字以内，语言精炼`,
    };

    const userPrompts: Record<string, string> = {
      industry: `数据：${JSON.stringify(data)}\n请分析行业/渠道结构数据，生成结论。`,
      grade: `数据：${JSON.stringify(data)}\n请分析项目等级结构数据，生成结论。`,
      node: `数据：${JSON.stringify(data)}\n请分析跟进节点分布数据，生成结论。`,
      risk: `数据：${JSON.stringify(data)}\n请分析高风险项目数据，生成结论。`,
      stagnant: `数据：${JSON.stringify(data)}\n请分析停滞项目数据，生成结论。`,
    };

    const messages = [
      {
        role: 'system' as const,
        content: systemPrompts[chartType] || systemPrompts.industry,
      },
      {
        role: 'user' as const,
        content: userPrompts[chartType] || userPrompts.industry,
      },
    ];

    // 使用流式输出
    const stream = client.stream(messages, {
      model: 'doubao-seed-1-6-251015',
      temperature: 0.7,
    });

    // 创建一个可读流
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI Insight API Error:', error);
    return NextResponse.json(
      { error: '生成结论失败', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
