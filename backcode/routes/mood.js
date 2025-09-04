// routes/ai.js
const express = require('express');
const router = express.Router();
const { analyzeSentiment } = require('../utils/sentmentAI'); // 引入 AI 函数

/**
 * POST /api/analyze
 * 仅进行 AI 情绪分析，不涉及数据库
 */
router.post('/analyze', async (req, res) => {
  const { content } = req.body;

  // 验证输入
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({
      status: 'error',
      message: '请输入有效的心情内容'
    });
  }

  try {
    const sentiment_score = await analyzeSentiment(content.trim());

    // ✅ 只返回 AI 分析结果
    res.json({
      status: 'success',
      data: {
        sentiment_score,  // 0-5
        content: content.trim()
      }
    });
  } catch (err) {
    console.error('情绪分析失败:', err);
    res.status(500).json({
      status: 'error',
      message: '情绪分析失败，请稍后重试'
    });
  }
});

module.exports = router;