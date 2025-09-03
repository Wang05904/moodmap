// utils/sentimentAI.js
const axios = require('axios');

const API_KEY = process.env.DASHSCOPE_API_KEY;

/**
 * 使用通义千问分析文本情绪，返回 1-5 级评分
 * @param {string} text - 用户输入的心情文本
 * @returns {number} - 情绪等级 1-5
 */
async function analyzeSentiment(text) {
  const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

  // 精心设计的 Prompt，确保返回数字
  const prompt = `
  请对以下文本的情绪进行1到5分的评分，1分表示极度负面，5分表示极度正面。
  只返回一个数字（1、2、3、4 或 5），不要任何解释或额外字符。
  
  文本：${text}
  评分：
  `;

  try {
    const response = await axios.post(url, {
      model: 'qwen-turbo',
      input: {
        messages: [
          { role: 'user', content: prompt }
        ]
      },
      parameters: {
        temperature: 0.1  // 降低随机性，提高一致性
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // 提取返回的数字
    let level = parseInt(response.data.output.text.trim());

    // 安全校验：确保在 1-5 范围内
    if (isNaN(level) || level < 1) level = 3;
    if (level > 5) level = 5;

    return level;
  } catch (error) {
    console.error('AI情绪分析失败:', error.response?.data || error.message);
    // 失败时返回默认中性分
    return 3;
  }
}

module.exports = { analyzeSentiment };