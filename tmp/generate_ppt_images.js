import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';
import axios from 'fs';
import fs from 'fs';

const config = new Config();
const client = new ImageGenerationClient(config);

// PPT页面图片生成列表
const imagePrompts = [
  {
    name: '01_cover',
    prompt: 'A professional business dashboard interface for commercial water purification, modern clean design, blue and green color scheme, data visualization charts and graphs, tech-style, high quality, 4K resolution'
  },
  {
    name: '02_data_layer',
    prompt: 'Data collection and aggregation flow diagram, multiple data sources converging into a central dashboard, blue color scheme, arrows showing data flow, clean business visualization, 4K resolution'
  },
  {
    name: '03_risk_layer',
    prompt: 'Risk warning dashboard interface with alert indicators, color-coded risk levels (red, yellow, green), data analytics charts, modern business intelligence interface, 4K resolution'
  },
  {
    name: '04_action_layer',
    prompt: 'Action-oriented task list interface, actionable recommendations, todo items with checkmarks, green theme, clean modern design, business productivity focus, 4K resolution'
  },
  {
    name: '05_goal_achievement',
    prompt: 'Goal achievement progress visualization, completion percentage bars, success indicators with green upward arrows, celebration elements, business growth theme, 4K resolution'
  },
  {
    name: '06_closed_loop',
    prompt: 'Circular workflow diagram showing Data to Risk to Action to Goal cycle, arrow loop process, blue and green gradient, clean business process visualization, 4K resolution'
  }
];

async function generatePPTImages() {
  console.log('开始生成PPT图片...');

  const requests = imagePrompts.map(item => ({
    prompt: item.prompt,
    size: '2K'
  }));

  try {
    const responses = await client.batchGenerate(requests);

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      const helper = client.getResponseHelper(response);
      const imageName = imagePrompts[i].name;

      if (helper.success && helper.imageUrls[0]) {
        // 下载图片
        const imageData = await axios.get(helper.imageUrls[0], { responseType: 'arraybuffer' });
        const outputPath = `/tmp/${imageName}.png`;
        fs.writeFileSync(outputPath, imageData.data);
        console.log(`✓ ${imageName} 生成成功: ${outputPath}`);
      } else {
        console.error(`✗ ${imageName} 生成失败:`, helper.errorMessages);
      }
    }

    console.log('\n所有图片生成完成！');
  } catch (error) {
    console.error('生成过程中出错:', error);
  }
}

generatePPTImages();
