import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const config = new Config();
    const client = new ImageGenerationClient(config);

    // PPT页面图片生成列表
    const imagePrompts = [
      {
        name: '01_cover',
        prompt: 'A professional business dashboard interface for commercial water purification, modern clean design, blue and green color scheme, data visualization charts and graphs, tech-style, high quality'
      },
      {
        name: '02_data_layer',
        prompt: 'Data collection and aggregation flow diagram, multiple data sources converging into a central dashboard, blue color scheme, arrows showing data flow, clean business visualization'
      },
      {
        name: '03_risk_layer',
        prompt: 'Risk warning dashboard interface with alert indicators, color-coded risk levels (red, yellow, green), data analytics charts, modern business intelligence interface'
      },
      {
        name: '04_action_layer',
        prompt: 'Action-oriented task list interface, actionable recommendations, todo items with checkmarks, green theme, clean modern design, business productivity focus'
      },
      {
        name: '05_goal_achievement',
        prompt: 'Goal achievement progress visualization, completion percentage bars, success indicators with green upward arrows, celebration elements, business growth theme'
      },
      {
        name: '06_closed_loop',
        prompt: 'Circular workflow diagram showing Data to Risk to Action to Goal cycle, arrow loop process, blue and green gradient, clean business process visualization'
      }
    ];

    const requests = imagePrompts.map(item => ({
      prompt: item.prompt,
      size: '2K'
    }));

    const responses = await client.batchGenerate(requests);

    const results = [];
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const helper = client.getResponseHelper(response);

      if (helper.success && helper.imageUrls[0]) {
        results.push({
          name: imagePrompts[i].name,
          url: helper.imageUrls[0],
          success: true
        });
      } else {
        results.push({
          name: imagePrompts[i].name,
          success: false,
          error: helper.errorMessages
        });
      }
    }

    return NextResponse.json({
      success: true,
      images: results
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
