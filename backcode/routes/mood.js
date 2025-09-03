// routes/mood.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 你的数据库连接
const { analyzeSentiment } = require('../utils/sentimentAI');

// 发布心情
router.post('/post', async (req, res) => {
  const { content, latitude, longitude } = req.body;
  const user_id = req.session.user_id; // 假设已登录

  if (!user_id) {
    return res.status(401).json({ error: '未登录' });
  }

  if (!content || !latitude || !longitude) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  try {
    // ✅ 使用 AI 分析情绪，返回 1-5 分
    const sentiment_score = await analyzeSentiment(content);

    // 插入数据库
    const sql = `
      INSERT INTO mood_entry 
      (user_id, content, sentiment_score, latitude, longitude)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(sql, [user_id, content, sentiment_score, latitude, longitude]);

    res.json({
      status: 'success',
      mood_id: result.insertId,
      sentiment_score  // 返回给前端展示
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '发布失败' });
  }
});

// 获取所有未删除的心情（用于地图展示）
router.get('/moods', (req, res) => {
  const sql = `
    SELECT me.*, u.avatar 
    FROM mood_entry me
    JOIN user u ON me.user_id = u.id
    WHERE me.is_deleted = FALSE
    ORDER BY me.created_at DESC
  `;

  db.execute(sql)
    .then(([rows]) => {
      res.json(rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '获取数据失败' });
    });
});

module.exports = router;