// routes/mood.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// 工厂函数：接收 db 实例
module.exports = (db) => {
  // ✅ AI 情绪分析函数（调用通义千问）
  async function analyzeSentiment(text) {
    const API_KEY = process.env.DASHSCOPE_API_KEY;

    if (!API_KEY) {
      console.error('错误：未设置 DASHSCOPE_API_KEY');
      return 3; // 默认中性
    }

    const prompt = `
请对以下文本的情绪进行1到5分的评分，1分表示极度负面，5分表示极度正面。
只返回一个数字（1、2、3、4 或 5），不要任何解释或额外字符。

文本：${text}
评分：
`;

    try {
      const response = await axios.post(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        {
          model: 'qwen-turbo',
          input: {
            messages: [{ role: 'user', content: prompt }]
          },
          parameters: { temperature: 0.1 }
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data.output.text.trim();
      let level = parseInt(text);
      return isNaN(level) || level < 1 ? 3 : level > 5 ? 5 : level;
    } catch (error) {
      console.error('AI分析失败:', error.message);
      return 3; // 失败时返回中性
    }
  }

  // 🔐 认证中间件（简单示例：检查 JWT）
  const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: '缺少认证 token' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { id, username }
      next();
    } catch (err) {
      res.status(403).json({ error: '无效或过期的 token' });
    }
  };

  // ✅ POST /api/mood/post - 发布心情
  router.post('/post', authenticate, async (req, res) => {
    const { content, latitude, longitude } = req.body;

    // 验证必填字段
    if (!content || !latitude || !longitude) {
      return res.status(400).json({ error: '缺少必要参数：content, latitude, longitude' });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'latitude 和 longitude 必须是数字' });
    }

    try {
      // AI 分析情绪得分
      const sentiment_score = await analyzeSentiment(content);

      // 插入数据库
      const sql = `
        INSERT INTO mood_entry (user_id, content, sentiment_score, latitude, longitude)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(
        sql,
        [req.user.id, content, sentiment_score, parseFloat(latitude), parseFloat(longitude)],
        (err, result) => {
          if (err) {
            console.error('数据库插入失败:', err);
            return res.status(500).json({ error: '发布失败' });
          }

          res.json({
            status: 'success',
            message: '心情发布成功',
            mood_id: result.insertId,
            sentiment_score
          });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: '服务器内部错误' });
    }
  });

  // ✅ GET /api/mood - 获取所有心情（用于地图展示）
  router.get('/', (req, res) => {
    const sql = `
      SELECT 
        me.mood_id,
        me.user_id,
        me.content,
        me.sentiment_score,
        me.latitude,
        me.longitude,
        me.created_at,
        u.username,
        u.avatar
      FROM mood_entry me
      JOIN user u ON me.user_id = u.id
      ORDER BY me.created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('查询心情列表失败:', err);
        return res.status(500).json({ error: '获取数据失败' });
      }

      res.json({
        status: 'success',
        data: results
      });
    });
  });

  // ✅ GET /api/mood/my - 获取当前用户的心情
  router.get('/my', authenticate, (req, res) => {
    const sql = `
      SELECT * FROM mood_entry 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    db.query(sql, [req.user.id], (err, results) => {
      if (err) {
        console.error('查询我的心情失败:', err);
        return res.status(500).json({ error: '获取数据失败' });
      }

      res.json({
        status: 'success',
        data: results
      });
    });
  });

  return router;
};