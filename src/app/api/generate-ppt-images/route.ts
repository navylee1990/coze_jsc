import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const config = new Config();
    const client = new ImageGenerationClient(config);

    // PPT页面图片生成列表（简化为1张流程图）
    const imagePrompts = [
      {
        name: '01_workflow',
        prompt: 'A modern business workflow diagram showing Data to Risk to Action flow, three connected boxes with arrows, blue for data, orange for risk, green for action, clean professional design with WeChat and chat bubble icons representing team collaboration features, high quality business illustration'
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
