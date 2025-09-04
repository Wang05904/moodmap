// routes/users.js
const express = require('express');
const router = express.Router();

// 将数据库连接池作为参数传递给模块
module.exports = function(db) {
  // 增加记录接口
  router.post('/sendRcd', async function(req, res) {
    const {username,content,latitude,longitude,sentiment_score} = req.body;
    const userId = await db.query('SELECT id FROM user WHERE username =?', [username]);
    console.log(userId);
    if (userId[0].length === 0) {
      res.json({
        code: 1,
        msg: '用户不存在'
      });
      return;
    }
    const result = await db.query('INSERT INTO mood_entry (user_id,content,sentiment_score,latitude,longitude,created_at) VALUES (?,?,?,?,?,?)', [userId[0][0].id,content,sentiment_score,latitude,longitude,new Date()]);
    res.json(result);
  });
  // 删除记录接口
  router.post('/deleteRcd', function(req, res) {
    
  });
  //获取个人记录接口
  router.get('/getRcdByUsername', async function(req, res) {
    const { username } = req.query;
    const userId = await db.query('SELECT id FROM user WHERE username =?', [username]);
    if (userId[0].length === 0) {
      res.json({
        code: 1,
        msg: '用户不存在'
      });
      return;
    }
    const records = await db.query('SELECT * FROM mood_entry WHERE user_id =?', [userId[0][0].id]);
    res.json(records[0]);
  });

  // 获取所有记录接口
  router.post('/getAllRcd', async function(req, res) {
    
  });
  return router;
};
